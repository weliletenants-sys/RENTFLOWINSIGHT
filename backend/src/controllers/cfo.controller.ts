import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

// 1. Overview Tab Data
export const getOverview = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Total Wallet Balances
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true } });
    const totalWalletBalance = wallets._sum.balance || 0;

    // Build date filter for Ledger queries if provided
    const dateFilter: any = {};
    if (start_date || end_date) {
      dateFilter.transaction_date = {};
      // Simplistic string filtering, in production would use true DateTime
      if (start_date) dateFilter.transaction_date.gte = String(start_date);
      if (end_date) dateFilter.transaction_date.lte = String(end_date);
    }

    const createdFilter: any = {};
    if (start_date || end_date) {
      createdFilter.created_at = {};
      if (start_date) createdFilter.created_at.gte = String(start_date);
      if (end_date) createdFilter.created_at.lte = String(end_date);
    }

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
    for (const rr of rentRequests) {
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) pendingRepayments += remaining;
    }

    // Counts
    const [totalUsers, totalAgents, totalTenants, totalSupporters] = await Promise.all([
      prisma.profiles.count({ where: { verified: true } }),
      prisma.userRoles.count({ where: { role: 'AGENT', enabled: true } }),
      prisma.userRoles.count({ where: { role: 'TENANT', enabled: true } }),
      prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true } })
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
        deposits: deposits._sum.amount || 0,
        withdrawals: withdrawals._sum.amount || 0,
        platformFees: fees._sum.amount || 0,
        pendingRepayments,
        transfers: 0,
        agentEarnings: 0,
        commissions: 0,
        bonuses: 0,
        rentFacilitated: 0
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
    const revenueSum = await prisma.generalLedger.aggregate({
      where: { category: 'platform_fee', direction: 'credit' },
      _sum: { amount: true }
    });
    const revenue = revenueSum._sum.amount || 0;

    const expenseSum = await prisma.generalLedger.aggregate({
      where: { 
        direction: 'debit',
        category: { in: ['commission', 'agent_payout', 'staff_salary', 'bonus'] }
      },
      _sum: { amount: true }
    });
    const expenses = expenseSum._sum.amount || 0;
    const profit = revenue - expenses;

    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true } });
    const liab = wallets._sum.balance || 0;
    
    // Simplistic Receivables check
    const rentRequests = await prisma.rentRequests.findMany({ where: { status: 'DISBURSED' } });
    let outstandingReceivables = 0;
    for (const rr of rentRequests) {
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) outstandingReceivables += remaining;
    }

    const assets = liab + outstandingReceivables + profit;
    const equity = assets - liab;

    const coverageRatio = liab > 0 ? (assets / liab) : 2.0;

    res.json({
      solvency: {
        coverageRatio: parseFloat(coverageRatio.toFixed(2)),
        status: coverageRatio > 1.2 ? 'Safe' : coverageRatio >= 1.0 ? 'Warning' : 'Risk'
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
    if (request.status?.toUpperCase() !== 'PENDING') {
      return problemResponse(res, 400, 'Validation Error', `Deposit request is not pending`, 'validation-error');
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

