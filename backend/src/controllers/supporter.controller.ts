import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: userId },
    });

    const totalContribution = portfolios.reduce((sum: number, p: any) => sum + p.investment_amount, 0);
    const returnPerMonth = portfolios.reduce((sum: number, p: any) => sum + (p.investment_amount * (p.roi_percentage / 100)), 0);

    return res.status(200).json({
      totalContribution,
      returnPerMonth,
      portfoliosCount: portfolios.length
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getVirtualHouses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    // Virtual Houses represent funded rent requests where the user is the funder
    const fundedRequests = await prisma.rentRequests.findMany({
      where: { supporter_id: userId, status: 'FUNDED' },
      select: {
        id: true,
        rent_amount: true,
        funded_at: true,
        amount_repaid: true,
        daily_repayment: true,
        access_fee: true,
        request_fee: true,
        duration_days: true,
      }
    });

    // Anonymize and map payment health
    const virtualHouses = fundedRequests.map((req: any) => {
      const totalPayable = req.rent_amount + req.access_fee + req.request_fee;
      const expectedDaysPassed = Math.floor((new Date().getTime() - new Date(req.funded_at).getTime()) / (1000 * 3600 * 24));
      const expectedPaid = Math.min(expectedDaysPassed * req.daily_repayment, totalPayable);
      
      let health = 'GREEN';
      if (req.amount_repaid < expectedPaid - (req.daily_repayment * 7)) health = 'RED';
      else if (req.amount_repaid < expectedPaid) health = 'YELLOW';

      return {
        id: `VH-${req.id.substring(0, 8)}`,
        rentAmount: req.rent_amount,
        fundedAt: req.funded_at,
        health,
      };
    });

    return res.status(200).json(virtualHouses);
  } catch (error) {
    console.error('Virtual Houses Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const fundPool = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount } = req.body;

    if (!amount || amount < 50000) {
      return res.status(400).json({ message: 'Invalid amount or below minimum (50,000)' });
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Atomic transaction logic simplified for migration placeholder
    // In complete application, this would run inside prisma.$transaction
    await prisma.generalLedger.create({
      data: {
        user_id: userId,
        amount,
        direction: 'cash_out',
        category: 'supporter_rent_fund',
        source_table: 'wallets',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    });

    await prisma.wallets.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - amount }
    });

    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: userId,
        investment_amount: amount,
        roi_percentage: 15,
        duration_months: 12,
        status: 'active',
        portfolio_code: `WPF-${Math.floor(Math.random() * 10000)}`,
        activation_token: 'active',
        portfolio_pin: '0000',
        roi_mode: 'monthly_compounding',
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Funded successfully', portfolio });
  } catch (error) {
    console.error('Fund Pool Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const proxyInvest = async (req: Request, res: Response) => {
  try {
    const agentId = req.user?.sub;
    const { partnerId, amount } = req.body;

    if (!partnerId || !amount || amount < 50000) {
      return res.status(400).json({ message: 'Invalid payload or amount too low' });
    }

    const agentWallet = await prisma.wallets.findFirst({ where: { user_id: agentId } });
    if (!agentWallet || agentWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient agent funds' });
    }

    // Deduct from Agent mapping
    await prisma.generalLedger.create({
      data: {
        user_id: agentId,
        amount,
        direction: 'cash_out',
        category: 'agent_proxy_investment',
        source_table: 'wallets',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    });

    await prisma.wallets.update({
      where: { id: agentWallet.id },
      data: { balance: agentWallet.balance - amount }
    });

    // Create pending portfolio for partner
    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: partnerId,
        agent_id: agentId,
        investment_amount: amount,
        roi_percentage: 15,
        duration_months: 12,
        status: 'pending_approval',
        portfolio_code: `WIP-${Math.floor(Math.random() * 10000)}`,
        activation_token: 'pending',
        portfolio_pin: '0000',
        roi_mode: 'monthly_compounding',
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Proxy investment queued for approval', portfolio });
  } catch (error) {
    console.error('Proxy Invest Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
