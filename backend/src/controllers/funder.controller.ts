import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const funderId = req.user.sub;
    
    // Get wallet balance
    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });
    
    // Get portfolios
    const portfolios = await prisma.investorPortfolios.findMany({ where: { investor_id: funderId } });
    
    const activePortfolios = portfolios.filter(p => p.status === 'ACTIVE');
    const totalInvested = activePortfolios.reduce((sum, p) => sum + Number(p.investment_amount), 0);
    
    // Calculate expected yield percentage
    const expectedYield = activePortfolios.length > 0 
      ? activePortfolios.reduce((sum, p) => sum + Number(p.roi_percentage), 0) / activePortfolios.length 
      : 0;

    return res.status(200).json({
      walletBalance: wallet?.balance || 0,
      totalInvested,
      expectedYield,
      activePortfolios: activePortfolios.length,
      pendingPortfolios: portfolios.filter(p => p.status === 'PENDING').length
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPortfolios = async (req: Request, res: Response) => {
  try {
    const funderId = req.user.sub;
    const portfolios = await prisma.investorPortfolios.findMany({ 
      where: { investor_id: funderId },
      orderBy: { created_at: 'desc' }
    });
    
    return res.status(200).json(portfolios);
  } catch (error) {
    console.error('getPortfolios error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const funderId = req.user.sub;
    
    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });
    if (!wallet) return res.status(200).json([]);

    const transactions = await prisma.walletTransactions.findMany({
      where: {
        OR: [
          { sender_id: funderId },
          { recipient_id: funderId }
        ]
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('getRecentActivities error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
