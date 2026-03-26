import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

const getDateFilters = (query: any) => {
  let { start_date, end_date, range } = query as { start_date?: string, end_date?: string, range?: string };

  if (range && !start_date && !end_date) {
    const now = new Date();
    let start = new Date();
    if (range === 'Today') {
      start.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      start.setDate(now.getDate() - 7);
    } else if (range === '30d') {
      start.setDate(now.getDate() - 30);
    } else if (range === 'Month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (range === 'Year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }
    
    start_date = start.toISOString();
    end_date = now.toISOString();
  }

  const dateFilter: any = {};
  if (start_date || end_date) {
    dateFilter.transaction_date = {};
    if (start_date) dateFilter.transaction_date.gte = String(start_date);
    if (end_date) dateFilter.transaction_date.lte = String(end_date);
  }

  const createdFilter: any = {};
  if (start_date || end_date) {
    createdFilter.created_at = {};
    if (start_date) createdFilter.created_at.gte = String(start_date);
    if (end_date) createdFilter.created_at.lte = String(end_date);
  }

  return { dateFilter, createdFilter };
};


// 1. Overview Tab Data
export const getOverview = async (req: Request, res: Response) => {
  try {
    const { dateFilter, createdFilter } = getDateFilters(req.query);
    
    // Total Wallet Balances
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true } });
    const totalWalletBalance = wallets._sum.balance || 0;


    // Total Partner Capital (Funder Portfolios)
    const portfolios = await prisma.investorPortfolios.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { investment_amount: true, total_roi_earned: true }
    });
    const totalPartnerCapital = (portfolios._sum.investment_amount || 0) + (portfolios._sum.total_roi_earned || 0);

    // Deposits (from Ledger or Deposits table)
    const deposits = await prisma.generalLedger.aggregate({
      where: { category: 'deposit', direction: 'credit', ...dateFilter },
      _sum: { amount: true }
    });

    // Withdrawals
    const withdrawals = await prisma.generalLedger.aggregate({
      where: { category: 'withdrawal', direction: 'debit', ...dateFilter },
      _sum: { amount: true }
    });

    // Platform Fees
    const fees = await prisma.generalLedger.aggregate({
      where: { category: 'platform_fee', direction: 'credit', ...dateFilter },
      _sum: { amount: true }
    });

    // Pending Repayments
    const rentRequests = await prisma.rentRequests.findMany({
      where: { status: 'DISBURSED', ...createdFilter }
    });
    
    let pendingRepayments = 0;
    let capitalDeployed = 0;
    for (const rr of rentRequests) {
      const principal = Number(rr.total_repayment) || 0;
      capitalDeployed += principal;
      const remaining = principal - Number(rr.amount_repaid);
      if (remaining > 0) pendingRepayments += remaining;
    }

    // Counts
    const [totalUsers, totalAgents, totalTenants, totalSupporters] = await Promise.all([
      prisma.profiles.count({ where: { verified: true } }),
      prisma.profiles.count({ where: { role: { in: ['AGENT', 'agent', 'partner'] } } }),
      prisma.profiles.count({ where: { role: { in: ['TENANT', 'tenant'] } } }),
      prisma.profiles.count({ where: { role: { in: ['FUNDER', 'funder', 'SUPPORTER', 'supporter'] } } })
    ]);

    // Financial Charts (last 7 days by default here for mock logic)
    // Normally we'd group by Date(transaction_date) but prisma string dates are tricky.
    // For now we'll send empty array to fulfill interface, or mocked trends
    const trends = [
      { date: '2023-10-01', profit: 12000, inflow: 50000, outflow: 30000 },
      { date: '2023-10-02', profit: 15000, inflow: 60000, outflow: 40000 }
    ];

    res.json({
      metrics: {
        totalWalletBalance,
        totalPartnerCapital,
        capitalDeployed,
        outstandingReceivables: pendingRepayments,
        deposits: deposits._sum.amount || 0,
        withdrawals: withdrawals._sum.amount || 0,
        platformFees: fees._sum.amount || 0,
        pendingRepayments,
        transfers: 0,
        agentEarnings: 0,
        commissions: 0,
        bonuses: 0,
        rentFacilitated: capitalDeployed
      },
      counts: {
        totalUsers,
        totalAgents,
        totalTenants,
        totalSupporters
      },
      trends
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Reconciliation Engine
export const getReconciliation = async (req: Request, res: Response) => {
  try {
    const wallets = await prisma.wallets.findMany({
      take: 200, // Batch limit
      orderBy: { created_at: 'desc' }
    });

    const results = [];
    let matchedCount = 0;
    let mismatchedCount = 0;
    let totalGap = 0;

    for (const wallet of wallets) {
      if (!wallet.user_id) continue;

      const profile = await prisma.profiles.findUnique({ where: { id: wallet.user_id } });

      const credits = await prisma.generalLedger.aggregate({
        where: { user_id: wallet.user_id, direction: 'credit' },
        _sum: { amount: true }
      });
      const debits = await prisma.generalLedger.aggregate({
        where: { user_id: wallet.user_id, direction: 'debit' },
        _sum: { amount: true }
      });

      const ledgerBalance = (credits._sum.amount || 0) - (debits._sum.amount || 0);
      const gap = wallet.balance - ledgerBalance;

      results.push({
        user_id: wallet.user_id,
        name: profile?.full_name || 'Unknown',
        phone: profile?.phone || 'Unknown',
        wallet_balance: wallet.balance,
        ledger_balance: ledgerBalance,
        gap,
        status: gap === 0 ? 'Matched' : 'Mismatched'
      });

      if (gap === 0) matchedCount++;
      else {
        mismatchedCount++;
        totalGap += Math.abs(gap);
      }
    }

    res.json({
      summary: {
        totalUsers: results.length,
        matched: matchedCount,
        mismatched: mismatchedCount,
        totalGap
      },
      results
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Withdrawals Approval Gate
export const getPendingWithdrawals = async (req: Request, res: Response) => {
  try {
    const list = await prisma.withdrawalRequests.findMany({
      where: { status: 'manager_approved' },
      orderBy: { created_at: 'desc' }
    });

    const enriched = await Promise.all(list.map(async w => {
      let profile = null;
      if (w.user_id) profile = await prisma.profiles.findUnique({ where: { id: w.user_id } });
      return {
        ...w,
        user_name: profile?.full_name || 'Unknown',
        user_phone: profile?.phone || 'Unknown',
        avatar_url: profile?.avatar_url || null
      };
    }));

    res.json({ withdrawals: enriched });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const request = await prisma.withdrawalRequests.findUnique({ where: { id } });
    if (!request) return problemResponse(res, 404, 'Not Found', `Request not found`, 'not-found');
    if (request.status !== 'manager_approved') return problemResponse(res, 400, 'Validation Error', `Request is not ready for CFO approval`, 'validation-error');

    // Validate Balance Check
    const wallet = await prisma.wallets.findFirst({ where: { user_id: request.user_id || undefined } });
    if (!wallet || wallet.balance < request.amount) {
      return problemResponse(res, 400, 'Validation Error', `Insufficient wallet balance`, 'validation-error');
    }

    // Validate Ledger Consistency (Gap detection)
    const credits = await prisma.generalLedger.aggregate({ where: { user_id: request.user_id, direction: 'credit' }, _sum: { amount: true } });
    const debits = await prisma.generalLedger.aggregate({ where: { user_id: request.user_id, direction: 'debit' }, _sum: { amount: true } });
    const ledgerBalance = (credits._sum.amount || 0) - (debits._sum.amount || 0);
    
    if (wallet.balance !== ledgerBalance) {
      return problemResponse(res, 400, 'Validation Error', `Reconciliation Error: Ledger gap detected. Approval blocked.`, 'validation-error');
    }

    const updated = await prisma.withdrawalRequests.update({
      where: { id },
      data: {
        status: 'cfo_approved',
        cfo_approved_at: new Date().toISOString(),
        cfo_approved_by: 'CFO_USER_ID' // Ideally from req.user
      }
    });

    res.json({ message: 'Withdrawal pushed to COO queue', request: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return problemResponse(res, 400, 'Validation Error', `Rejection reason is required`, 'validation-error');
    }

    const updated = await prisma.withdrawalRequests.update({
      where: { id },
      data: {
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Withdrawal rejected', request: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 4. General Ledger
export const getLedger = async (req: Request, res: Response) => {
  try {
    const ledger = await prisma.generalLedger.findMany({
      orderBy: { created_at: 'desc' },
      take: 100
    });
    res.json({ ledger });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Solvency and Statements (Simplified)
export const getStatements = async (req: Request, res: Response) => {
  try {
    const { dateFilter } = getDateFilters(req.query);
    const revenueSum = await prisma.generalLedger.aggregate({
      where: { category: 'platform_fee', direction: 'credit', ...dateFilter },
      _sum: { amount: true }
    });
    const revenue = revenueSum._sum.amount || 0;

    const expenseSum = await prisma.generalLedger.aggregate({
      where: { 
        direction: 'debit',
        category: { in: ['commission', 'agent_payout', 'staff_salary', 'bonus'] },
        ...dateFilter
      },
      _sum: { amount: true }
    });
    const expenses = expenseSum._sum.amount || 0;
    const profit = revenue - expenses;

    const portfolios = await prisma.investorPortfolios.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { investment_amount: true, total_roi_earned: true }
    });
    const totalPartnerCapital = (portfolios._sum.investment_amount || 0) + (portfolios._sum.total_roi_earned || 0);

    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true } });
    
    // The true operational liability base is now Company Capital raised from Funders
    const liab = totalPartnerCapital;
    
    // Simplistic Receivables check
    const rentRequests = await prisma.rentRequests.findMany({ where: { status: 'DISBURSED' } });
    let outstandingReceivables = 0;
    let totalFunded = 0;
    let totalRepaid = 0;
    for (const rr of rentRequests) {
      totalRepaid += Number(rr.amount_repaid) || 0;
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) outstandingReceivables += remaining;
    }
    totalFunded = totalRepaid + outstandingReceivables;

    const assets = liab + outstandingReceivables + profit;
    const equity = assets - liab;

    const coverageRatio = liab > 0 ? (assets / liab) : 2.0;

    res.json({
      solvency: {
        coverageRatio: parseFloat(coverageRatio.toFixed(2)),
        targetRatio: 1.2,
        bufferHealth: coverageRatio >= 1.2 ? 'Healthy' : coverageRatio >= 1.0 ? 'Warning' : 'Critical',
        liquidity: { available: assets, obligations: liab },
        breakdown: { totalFunded, totalRepaid, outstandingBalance: outstandingReceivables }
      },
      incomeStatement: { revenue, expenses, profit },
      balanceSheet: { assets, liabilities: liab, equity }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cfoId = req.user?.sub;

    if (!cfoId) {
      return problemResponse(res, 401, 'Unauthorized', `Missing authentication token`, 'unauthorized');
    }

    const request = await prisma.depositRequests.findUnique({ where: { id } });
    if (!request) {
      return problemResponse(res, 404, 'Not Found', `Deposit request not found`, 'not-found');
    }
    if (request.status?.toUpperCase() !== 'COO_APPROVED') {
      return problemResponse(res, 400, 'Validation Error', `Deposit request has not been verified by operations yet`, 'validation-error');
    }

    const targetUserId = request.user_id;
    if (!targetUserId || targetUserId === 'unlinked') {
      return problemResponse(res, 400, 'Validation Error', `Deposit request is not linked to a valid user account`, 'validation-error');
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: targetUserId } });
    if (!wallet) {
      return problemResponse(res, 404, 'Not Found', `Target wallet not found`, 'not-found');
    }

    const now = new Date().toISOString();

    const [updatedWallet, updatedRequest, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { increment: request.amount }, updated_at: now }
      }),
      prisma.depositRequests.update({
        where: { id },
        data: {
          status: 'APPROVED',
          processed_by: cfoId,
          // @ts-ignore
          cfo_id: cfoId,
          // @ts-ignore
          cfo_approved_at: now,
          approved_at: now,
          updated_at: now
        }
      }),
      prisma.walletTransactions.create({
        data: {
          amount: request.amount,
          description: 'Deposit Approved by CFO',
          recipient_id: targetUserId,
          created_at: now
        }
      }),
      prisma.generalLedger.create({
        data: {
          user_id: targetUserId,
          amount: request.amount,
          direction: 'credit',
          category: 'deposit',
          source_table: 'deposit_requests',
          source_id: request.id,
          transaction_date: now,
          created_at: now
        }
      }),
      prisma.notifications.create({
        data: {
          user_id: targetUserId,
          title: 'Deposit Approved',
          message: `Your deposit request of UGX ${request.amount} has been approved and added to your wallet.`,
          type: 'DEPOSIT_APPROVED',
          is_read: false,
          created_at: now,
          updated_at: now
        }
      })
    ]);

    return res.status(200).json({ message: 'Deposit successfully approved and verified', depositRequest: updatedRequest });
  } catch (error: any) {
    console.error('approveDeposit error:', error);
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-server-error');
  }
};

export const getPendingCommissions = async (req: Request, res: Response) => {
  try {
    const payouts = await prisma.agentCommissionPayouts.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'desc' }
    });

    const enriched = await Promise.all(payouts.map(async p => {
      let profile = null;
      if (p.agent_id) profile = await prisma.profiles.findUnique({ where: { id: p.agent_id } });
      return {
        id: p.id,
        agentName: profile?.full_name || 'Unknown Agent',
        amount: p.amount,
        provider: p.mobile_money_provider,
        number: p.mobile_money_number,
        status: 'Pending',
        requestedAt: new Date(p.created_at).toLocaleDateString()
      };
    }));

    res.json({ commissions: enriched });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveCommission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cfoId = req.user?.sub;
    
    const payout = await prisma.agentCommissionPayouts.findUnique({ where: { id } });
    if (!payout) return problemResponse(res, 404, 'Not Found', 'Payout not found', 'not-found');

    const updated = await prisma.agentCommissionPayouts.update({
      where: { id },
      data: {
        status: 'APPROVED',
        processed_by: cfoId,
        updated_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Commission approved', commission: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectCommission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const cfoId = req.user?.sub;
    
    if (!reason || reason.trim() === '') {
      return problemResponse(res, 400, 'Validation Error', 'Reason required', 'validation-error');
    }

    const updated = await prisma.agentCommissionPayouts.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejection_reason: reason,
        processed_by: cfoId,
        updated_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Commission rejected', commission: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPredictiveRunway = async (req: Request, res: Response) => {
  try {
    // 1. Get Current Cash Balance (Platform Wallets)
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true }});
    const currentCashBal = wallets._sum.balance || 0;

    // 2. Extrapolate Monthly Burn Rate
    // In a real app, we'd average the last 3 months of General Ledger outflows (salaries, tech, ops).
    // For now, we'll calculate a structural estimate based on active agents * commission baseline + fixed costs.
    const activeAgents = await prisma.profiles.count({ where: { role: { in: ['AGENT', 'agent'] }, is_frozen: false } });
    const estAgentPayouts = activeAgents * 800000; // rough 800k ugx avg commission
    const fixedOps = 15000000; // 15M UGX fixed server/admin costs
    
    // Extrapolate Inflows (Platform fees from recent collections)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const recentCollections = await prisma.agentCollections.aggregate({
      where: { created_at: { gte: thirtyDaysAgo } },
      _sum: { amount: true }
    });
    const monthlyInflowEstimate = (recentCollections._sum.amount || 0) * 0.05; // 5% platform fee margin

    const monthlyOutflowEstimate = estAgentPayouts + fixedOps;
    const monthlyBurnRate = monthlyOutflowEstimate - monthlyInflowEstimate;
    
    // 3. Extrapolate Runway
    let runwayMonths = 999;
    if (monthlyBurnRate > 0) {
      runwayMonths = currentCashBal / monthlyBurnRate;
    }

    // Determine Cash-Zero Date
    let projectedCashZeroDate = 'Stable';
    if (monthlyBurnRate > 0) {
      const zeroDate = new Date();
      zeroDate.setMonth(zeroDate.getMonth() + Math.floor(runwayMonths));
      projectedCashZeroDate = zeroDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // 4. Generate 6-Month Projection Array
    const projection = [];
    let rollingCash = currentCashBal;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();

    for (let i = 0; i < 6; i++) {
        const targetMonth = months[(currentMonthIdx + i) % 12];
        
        projection.push({
            month: targetMonth,
            cash: Math.max(0, rollingCash),
            inflows: monthlyInflowEstimate,
            outflows: monthlyOutflowEstimate
        });

        rollingCash -= monthlyBurnRate;
    }

    res.json({
        runwayMonths: Number(runwayMonths.toFixed(1)),
        monthlyBurnRate: monthlyBurnRate > 0 ? monthlyBurnRate : 0,
        projectedCashZeroDate,
        currentCashBal,
        projection
    });
  } catch (error: any) {
    console.error('getPredictiveRunway error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getForwardedDeposits = async (req: Request, res: Response) => {
  try {
    const deposits = await prisma.depositRequests.findMany({
      where: { status: 'COO_APPROVED' },
      orderBy: { updated_at: 'desc' }
    });

    const enriched = await Promise.all(deposits.map(async d => {
      let profile = null;
      if (d.user_id) profile = await prisma.profiles.findUnique({ where: { id: d.user_id } });
      return {
        ...d,
        user_name: profile?.full_name || 'Unknown',
        user_phone: profile?.phone || 'Unknown',
        avatar_url: profile?.avatar_url || null
      };
    }));

    res.json({ deposits: enriched });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-error');
  }
};
