import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CfoService = {
  /**
   * Retrieves the absolute global overview using the strict GeneralLedger account mappings.
   */
  async getLedgerOverview() {
    // 1. Cash (Cash = SUM account_type: 'cash')
    const cashAgg = await prisma.generalLedger.aggregate({
      where: { account_type: 'cash' },
      _sum: { amount: true }
    });
    const totalCash = cashAgg._sum?.amount || 0;

    // 2. Receivables (Assets)
    const receivablesAgg = await prisma.generalLedger.aggregate({
      where: {
        category: {
          in: ['rent_principal_outstanding', 'rent_fee_outstanding', 'agent_advance_outstanding']
        }
      },
      _sum: { amount: true }
    });
    const totalReceivables = receivablesAgg._sum?.amount || 0;

    // 3. Liabilities (Payables & Wallets)
    const liabilitiesAgg = await prisma.generalLedger.aggregate({
      where: {
        category: {
          in: ['wallet_balance', 'roi_payable', 'agent_payable', 'withdrawal_payable']
        }
      },
      _sum: { amount: true }
    });
    const totalLiabilities = liabilitiesAgg._sum?.amount || 0;

    // 4. Platform Revenue
    const revenueAgg = await prisma.generalLedger.aggregate({
      where: {
        category: {
          in: ['access_fee_collected', 'registration_fee_collected', 'service_fee', 'penalty_fee']
        }
      },
      _sum: { amount: true }
    });
    const totalRevenue = revenueAgg._sum?.amount || 0;

    // 5. Expenses
    const expensesAgg = await prisma.generalLedger.aggregate({
      where: {
        category: {
          in: ['roi_expense', 'agent_commission_expense', 'operational_expense']
        }
      },
      _sum: { amount: true }
    });
    const totalExpenses = expensesAgg._sum?.amount || 0;

    // 6. Profit
    const profit = totalRevenue - totalExpenses;

    // 7. Money Flow Trend Indicators (Inflows vs Outflows past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString();

    const inflowsAgg = await prisma.generalLedger.aggregate({
      where: {
        created_at: { gte: dateStr },
        category: { in: ['partner_funding', 'tenant_repayment', 'wallet_deposit', 'external_funding'] }
      },
      _sum: { amount: true }
    });
    const outflowsAgg = await prisma.generalLedger.aggregate({
      where: {
        created_at: { gte: dateStr },
        category: { in: ['rent_payment', 'withdrawal', 'roi_payout', 'agent_commission_payout', 'advance_disbursement', 'platform_expense'] }
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
    const accruedAgg = await prisma.generalLedger.aggregate({
      where: { category: 'roi_accrued' },
      _sum: { amount: true }
    });
    const roiAccrued = accruedAgg._sum?.amount || 0;

    // 2. ROI Paid
    const paidAgg = await prisma.generalLedger.aggregate({
      where: { category: 'roi_payout' },
      _sum: { amount: true }
    });
    const roiPaid = paidAgg._sum?.amount || 0;

    // 3. ROI Pending
    const pendingAgg = await prisma.generalLedger.aggregate({
      where: { category: 'roi_payable' },
      _sum: { amount: true }
    });
    const roiPending = pendingAgg._sum?.amount || 0;

    // 4. Platform Revenue (needed for Coverage limit)
    const revenueAgg = await prisma.generalLedger.aggregate({
      where: {
        category: {
          in: ['access_fee_collected', 'registration_fee_collected', 'service_fee', 'penalty_fee']
        }
      },
      _sum: { amount: true }
    });
    const totalRevenue = revenueAgg._sum?.amount || 0;

    // 5. ROI Coverage % = Platform Revenue / ROI Paid
    // Fallback to avoid division by zero
    const roiCoveragePercentage = roiPaid > 0 ? (totalRevenue / roiPaid) * 100 : 100;

    // 6. ROI History Table latest 50
    const history = await prisma.generalLedger.findMany({
      where: { category: { in: ['roi_accrued', 'roi_payout', 'investment_reinvestment'] } },
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
      history
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
