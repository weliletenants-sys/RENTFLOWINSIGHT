import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    // Fetch Visits Today
    const visits = await prisma.agentVisits.count({
      where: {
        agent_id: userId,
        created_at: { gte: todayISO }
      }
    });

    // Fetch Collections Today
    const collections = await prisma.agentCollections.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: {
        agent_id: userId,
        created_at: { gte: todayISO }
      }
    });

    // Fetch Float Limit (Assuming standard agent mapping)
    const floatRecord = await prisma.agentFloatLimits.findFirst({
        orderBy: { created_at: 'desc' }
    });

    // Fetch Wallet Balance (Dynamic assumption based on user relation or fallback to 0 until wallet table is strictly verified)
    const walletBalance = 0; // TBD via ledger aggregation or native Wallets table

    return res.status(200).json({
      visits_today: visits,
      collections_count: collections._count.id || 0,
      collections_amount: collections._sum.amount || 0,
      float_limit: floatRecord?.float_limit || 0,
      collected_today: floatRecord?.collected_today || 0,
      wallet_balance: walletBalance
    });
  } catch (error) {
    console.error('getDashboardSummary error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReferrals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Assuming Users table maps referral links or we aggregate via agent_earnings 'referral_bonus'
    const referralEarnings = await prisma.agentEarnings.findMany({
        where: { agent_id: userId, earning_type: 'referral_bonus' },
        orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ referrals: referralEarnings });
  } catch (error) {
    console.error('getReferrals error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const earnings = await prisma.agentEarnings.findMany({
      where: { agent_id: userId },
      orderBy: { created_at: 'desc' }
    });

    // Optional: Fetch global Earning Baselines to compare against
    const baselines = await prisma.earningBaselines.findFirst({
        orderBy: { last_calculated_at: 'desc' }
    });

    return res.status(200).json({ earnings, baselines });
  } catch (error) {
    console.error('getEarnings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
