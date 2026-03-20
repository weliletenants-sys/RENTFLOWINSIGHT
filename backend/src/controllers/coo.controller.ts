import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

export const getOverviewMetrics = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD prefix matcher for string dates

    // 1. Demographics
    const totalInvestors = await prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true } });
    const activeAgents = await prisma.userRoles.count({ where: { role: 'AGENT', enabled: true } });
    const activeAccounts = await prisma.profiles.count({ where: { verified: true } });

    // 2. Portfolios (Total Investments)
    const portfolios = await prisma.investorPortfolios.aggregate({ _sum: { investment_amount: true } });
    const totalInvestments = portfolios._sum.investment_amount || 0;

    // 3. Collections (Daily)
    const collections = await prisma.agentCollections.aggregate({
      where: { created_at: { startsWith: today } },
      _sum: { amount: true }
    });
    const dailyCollections = collections._sum.amount || 0;

    // 4. Operations
    const visits = await prisma.agentVisits.count({
      where: { created_at: { startsWith: today } }
    });

    // 5. Risks
    // Missed payments: RentRequests that are DISBURSED but not fully repaid
    const disbursedRequests = await prisma.rentRequests.findMany({
      where: { status: 'DISBURSED' }
    });
    let missedPaymentsCount = 0;
    for (const req of disbursedRequests) {
        if (req.amount_repaid < req.total_repayment) {
            missedPaymentsCount++;
        }
    }

    // 6. Withdrawals
    const pendingWithdrawals = await prisma.withdrawalRequests.aggregate({
      where: { status: 'manager_approved' },
      _sum: { amount: true },
      _count: true
    });

    // 7. Wallet Monitoring
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true }});
    const mainFloat = wallets._sum.balance || 0;
    const agentEscrow = mainFloat * 0.12; // Static mock slice matching frontend for now

    res.json({
        totalInvestors,
        totalInvestments,
        dailyCollections,
        activeAgents,
        activeAccounts,
        todaysVisits: visits,
        missedPaymentsCount: missedPaymentsCount, // Using the computed value
        pendingWithdrawalsAmount: pendingWithdrawals._sum.amount || 0,
        pendingWithdrawalsCount: pendingWithdrawals._count || 0,
        walletMonitoring: {
           mainFloat,
           agentEscrow
        }
    });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};
