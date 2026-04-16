import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CfoService = {

  // Helper: Balances derived exactly from V2 Financial Accounts
  async getCategoryNetBalance(accountIds: string[], balanceType: 'ASSET' | 'LIABILITY' | 'REVENUE' | 'EXPENSE') {
    // In V2, we calculate real-time net balances from the immutable entries rather than trusting a cached cell blindly
    const credits = await prisma.financialEntries.aggregate({
        where: { account_id: { in: accountIds }, type: 'CREDIT' },
        _sum: { amount: true }
    });
    const debits = await prisma.financialEntries.aggregate({
        where: { account_id: { in: accountIds }, type: 'DEBIT' },
        _sum: { amount: true }
    });

    const c = credits._sum.amount || 0;
    const d = debits._sum.amount || 0;

    // Normal balance alignments for standard accounting:
    // ASSET/EXPENSE: Debit increases, Credit decreases (Net = D - C)
    // LIABILITY/REVENUE: Credit increases, Debit decreases (Net = C - D)
    if (balanceType === 'ASSET' || balanceType === 'EXPENSE') {
        return d - c;
    }
    return c - d;
  },

  /**
   * Retrieves the absolute global overview using the strict V2 FinancialAccounts Layer
   */
  async getLedgerOverview() {
    // 1. Cash (Cash = Wallets + Escrow active holdings, etc.)
    const cashAgg = await prisma.financialAccounts.aggregate({
      where: { type: 'WALLET' },
      _sum: { balance: true }
    });
    // Systemic holding accounts
    const sysCash = await this.getCategoryNetBalance(['ASSET_CASH_HOLDINGS'], 'ASSET');
    const totalCash = (cashAgg._sum?.balance || 0) + sysCash;

    // 2. Receivables (Assets)
    const totalReceivables = await this.getCategoryNetBalance(['ASSET_RENT_RECEIVABLE'], 'ASSET');

    // 3. Liabilities (Payables & Wallets)
    const liabilitiesCategories = await this.getCategoryNetBalance(
      ['LIAB_ROI_PAYABLE', 'LIAB_AGENT_PAYABLE', 'LIAB_WALLET_WITHDRAWALS'],
       'LIABILITY'
    );
    const totalLiabilities = (cashAgg._sum?.balance || 0) + liabilitiesCategories;

    // 4. Platform Revenue
    const totalRevenue = await this.getCategoryNetBalance(
      ['REV_ACCESS_FEES', 'REV_REGISTRATION_FEES', 'REV_MARKETPLACE', 'REV_PENALTIES'], 
      'REVENUE'
    );

    // 5. Expenses
    const totalExpenses = await this.getCategoryNetBalance(
      ['EXP_COMMISSIONS', 'EXP_OPERATIONAL', 'EXP_ROI_PAYOUTS'], 
      'EXPENSE'
    );

    // 6. Profit
    const profit = totalRevenue - totalExpenses;

    // 7. Money Flow Trend Indicators (Inflows vs Outflows past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Inflows -> Total credits into standard asset holding accounts in 30d
    const inflowsIds = ['partner_funding', 'tenant_repayment', 'wallet_deposit', 'external_funding'].map(c => `SYS_PLATFORM_${c}`.toUpperCase());
    const inflowsAgg = await prisma.financialEntries.aggregate({
      where: {
        created_at: { gte: thirtyDaysAgo },
        account_id: { in: inflowsIds },
        type: 'CREDIT'
      },
      _sum: { amount: true }
    });
    
    const outflowsIds = ['rent_payment', 'withdrawal', 'roi_payout', 'agent_commission_payout', 'advance_disbursement', 'platform_expense'].map(c => `SYS_PLATFORM_${c}`.toUpperCase());
    const outflowsAgg = await prisma.financialEntries.aggregate({
      where: {
        created_at: { gte: thirtyDaysAgo },
        account_id: { in: outflowsIds },
        type: 'DEBIT'
      },
      _sum: { amount: true }
    });

    const monthlyInflows = inflowsAgg._sum?.amount || 0;
    const monthlyOutflows = outflowsAgg._sum?.amount || 0;

    return {
      cash: totalCash,
      receivables: totalReceivables,
      liabilities: totalLiabilities,
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: profit,
      moneyFlow: {
        inflows: monthlyInflows,
        outflows: monthlyOutflows
      }
    };
  },

  /**
   * Generates the structured ROI Dashboard logic
   */
  async getRoiDashboard() {
    // 1. ROI Accrued
    const roiAccrued = await this.getCategoryNetBalance(['LIAB_ROI_PAYABLE'], 'LIABILITY'); // Using liability for accruals

    // 2. ROI Paid
    const roiPaid = await this.getCategoryNetBalance(['EXP_ROI_PAYOUTS'], 'EXPENSE'); 

    // 3. ROI Pending
    const roiPending = await this.getCategoryNetBalance(['LIAB_ROI_PAYABLE'], 'LIABILITY');

    // 4. Platform Revenue (needed for Coverage limit)
    const totalRevenue = await this.getCategoryNetBalance(
      ['REV_ACCESS_FEES', 'REV_REGISTRATION_FEES', 'REV_MARKETPLACE', 'REV_PENALTIES'], 
      'REVENUE'
    );

    // 5. ROI Coverage % = Platform Revenue / ROI Paid
    // Fallback to avoid division by zero
    const roiCoveragePercentage = roiPaid > 0 ? (totalRevenue / roiPaid) * 100 : 100;

    // 6. ROI History Table latest 50
    const historyAccounts = ['roi_accrued', 'roi_payout', 'investment_reinvestment'].map(c => `SYS_PLATFORM_${c}`.toUpperCase());
    const history = await prisma.financialEntries.findMany({
      where: { account_id: { in: historyAccounts } },
      include: { transaction: true },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    return {
      metrics: {
        roiAccrued,
        roiPaid,
        roiPending,
        roiCoveragePercentage
      },
      history: history.map(h => ({
         id: h.id,
         amount: h.amount,
         type: h.type,
         date: h.created_at,
         category: (h.transaction.metadata as any)?.category,
         reference: h.transaction.reference
      }))
    };
  },

  /**
   * Identifies systemic risks strictly from Ledger ratios.
   */
  async getRiskAlerts() {
    const overview = await this.getLedgerOverview();
    const roi = await this.getRoiDashboard();

    const alerts = [];

    // Alert: Cash < 15% of liabilities
    const reserveThreshold = overview.liabilities * 0.15;
    if (overview.cash < reserveThreshold) {
      alerts.push({
        severity: 'CRITICAL',
        type: 'LIQUIDITY_WARNING',
        message: 'Cash channel drops below 15% of platform liabilities.'
      });
    }

    // Alert: ROI Accrued > Revenue
    if (roi.metrics.roiAccrued > overview.revenue) {
      alerts.push({
        severity: 'HIGH',
        type: 'ROI_DANGER',
        message: 'Accrued ROI exceeds aggregate platform revenue. Deficit mode.'
      });
    }

    // Alert: Negative cash channel
    if (overview.cash <= 0) {
      alerts.push({
        severity: 'CRITICAL',
        type: 'CASH_ZERO',
        message: 'Global Cash equivalent is zero or negative.'
      });
    }

    return alerts;
  }
};
