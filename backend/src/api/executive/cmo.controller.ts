import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';

export const getCmoMetrics = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    
    // Compute DAU, MAU windows
    const oneDayAgo = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    const totalUsers = await prisma.profiles.count();
    const dauCount = await prisma.profiles.count({ where: { updated_at: { gte: oneDayAgo.toISOString() } } });
    const wauCount = await prisma.profiles.count({ where: { updated_at: { gte: sevenDaysAgo.toISOString() } } });
    const mauCount = await prisma.profiles.count({ where: { updated_at: { gte: thirtyDaysAgo.toISOString() } } });

    // Funnel Conversions - Total profiles mapped to roles
    const usersWithTenantRoles = await prisma.userRoles.count({ where: { role: 'TENANT' } });
    const usersWithAgentRoles = await prisma.userRoles.count({ where: { role: 'AGENT' } });
    
    // Referral Leaderboard Aggregate
    const rawReferrals = await prisma.referrals.groupBy({
        by: ['referrer_id'],
        _count: {
            referred_id: true,
        },
        orderBy: {
            _count: {
                referred_id: 'desc'
            }
        },
        take: 10
    });

    const leaderboardSet = [];
    for (const leader of rawReferrals) {
        if (!leader.referrer_id) continue;
        const profile = await prisma.profiles.findUnique({
            where: { id: leader.referrer_id },
            select: { full_name: true, phone: true }
        });
        if (profile) {
            leaderboardSet.push({ name: profile.full_name || profile.phone, count: leader._count.referred_id });
        }
    }

    return res.status(200).json({
       success: true,
       data: {
          metrics: { dauCount, wauCount, mauCount, totalUsers },
          conversions: { tenants: usersWithTenantRoles, agents: usersWithAgentRoles },
          leaderboard: leaderboardSet
       }
    });

  } catch (error: any) {
    console.error('[CMO Telemetry Generation Error]', error.message);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed calculating marketing funnel aggregates.', 'internal-server-error');
  }
};
