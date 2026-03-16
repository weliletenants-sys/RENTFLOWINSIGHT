import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const application = await prisma.agentApplications.findFirst({
      where: { agent_id: userId }
    });

    if (!application) {
      return res.status(200).json({ status: 'NONE' });
    }

    if (application.status === 'PENDING') {
      return res.status(200).json({ status: 'UNDER_REVIEW' });
    }

    return res.status(200).json({ status: application.status });
  } catch (error) {
    console.error('getKycStatus error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitKyc = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const now = new Date().toISOString();

    const application = await prisma.agentApplications.upsert({
      where: { agent_id: userId },
      update: { status: 'PENDING', updated_at: now },
      create: { agent_id: userId, status: 'PENDING', submitted_at: now, updated_at: now }
    });

    return res.status(200).json({ message: 'KYC submitted successfully', status: 'UNDER_REVIEW' });
  } catch (error) {
    console.error('submitKyc error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecruitmentStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const totalClients = await prisma.profiles.count({ where: { referrer_id: userId } });
    
    // For demo purposes, we mock pendingPayments and conversionRate
    const pendingPayments = Math.floor(totalClients * 0.3);
    const conversionRate = totalClients === 0 ? 0 : Math.round(((totalClients - pendingPayments) / totalClients) * 100);

    return res.status(200).json({
      totalClients,
      pendingPayments,
      conversionRate
    });
  } catch (error) {
    console.error('getRecruitmentStats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
