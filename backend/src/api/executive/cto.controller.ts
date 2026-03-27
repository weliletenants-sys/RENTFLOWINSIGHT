import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';

export const getCtoMetrics = async (req: Request, res: Response) => {
  try {
    const start = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const end = performance.now();
    const dbLatency = end - start;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isoDateStr = sevenDaysAgo.toISOString();

    const [
      totalUsers,
      activeUsers7d,
      rentRequestsTotal,
      rentRequestsPending,
      rentRequestsActive,
      rentRequestsCompleted,
      rentRequestsFailed,
      systemEventsCount,
      securityAlertsCount,
      totalLandlords,
      totalReferrals,
      totalLedgerEntries,
      totalNotifications,
      totalDepositRequests,
      totalPortfolios,
    ] = await Promise.all([
      prisma.profiles.count(),
      prisma.profiles.count({ where: { updated_at: { gte: isoDateStr } } }),
      prisma.rentRequests.count(),
      prisma.rentRequests.count({ where: { status: { in: ['pending', 'submitted'] } } }),
      prisma.rentRequests.count({ where: { status: { in: ['approved', 'funded', 'disbursed', 'active', 'repaying'] } } }),
      prisma.rentRequests.count({ where: { status: { in: ['completed', 'repaid', 'fully_repaid'] } } }),
      prisma.rentRequests.count({ where: { status: { in: ['rejected', 'defaulted', 'cancelled'] } } }),
      prisma.notifications.count({ where: { type: { in: ['error', 'alert', 'warning'] } } }),
      prisma.notifications.count({
        where: {
          OR: [
            { type: 'security' },
            { title: { contains: 'fraud', mode: 'insensitive' } },
            { title: { contains: 'frozen', mode: 'insensitive' } }
          ]
        }
      }),
      prisma.landlords.count(),
      prisma.referrals.count(),
      prisma.generalLedger.count(),
      prisma.notifications.count(),
      prisma.depositRequests.count(),
      prisma.investorPortfolios.count()
    ]);

    const recentDeposits = await prisma.depositRequests.findMany({
      where: { status: { in: ['approved', 'rejected'] } },
      select: { created_at: true, updated_at: true },
      take: 100,
      orderBy: { updated_at: 'desc' }
    });

    let avgProcessingTimeHours = 0;
    if (recentDeposits.length > 0) {
      const totalMs = recentDeposits.reduce((acc, dep) => {
        return acc + (new Date(dep.updated_at).getTime() - new Date(dep.created_at).getTime());
      }, 0);
      avgProcessingTimeHours = (totalMs / recentDeposits.length) / (1000 * 60 * 60);
    }

    const tableSizes = [
      { name: 'profiles', count: totalUsers },
      { name: 'rent_requests', count: rentRequestsTotal },
      { name: 'landlords', count: totalLandlords },
      { name: 'referrals', count: totalReferrals },
      { name: 'general_ledger', count: totalLedgerEntries },
      { name: 'notifications', count: totalNotifications },
      { name: 'deposit_requests', count: totalDepositRequests },
      { name: 'investor_portfolios', count: totalPortfolios },
    ].sort((a, b) => b.count - a.count);

    const totalDbRows = tableSizes.reduce((sum, t) => sum + t.count, 0);

    let dbStatus = 'Healthy';
    if (dbLatency > 1000) dbStatus = 'Degraded';
    else if (dbLatency > 300) dbStatus = 'Slow';

    res.json({
      timestamp: new Date().toISOString(),
      kpis: {
        dbResponseTimeMs: parseInt(dbLatency.toFixed(0)),
        dbConnectionStatus: dbStatus,
        activeUsers7d,
        totalUsers,
        systemEventsCount,
        securityAlertsCount,
        totalDbRows,
        avgProcessingTimeHours: parseFloat(avgProcessingTimeHours.toFixed(2)),
      },
      pipeline: {
        total: rentRequestsTotal,
        pending: rentRequestsPending,
        active: rentRequestsActive,
        completed: rentRequestsCompleted,
        failed: rentRequestsFailed,
      },
      tableSizes,
    });
  } catch (error) {
    console.error('Failed to fetch CTO metrics:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed computing infrastructure telemetry thresholds.', 'internal-server-error');
  }
};
