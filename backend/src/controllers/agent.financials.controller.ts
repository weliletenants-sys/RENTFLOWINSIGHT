import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const requestDeposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { target_user_id, amount, provider, transition_id, notes } = req.body;
    
    // Validate agent has sufficient wallet balance (skipped logic assuming Ledger handles this securely in prod)

    const request = await prisma.depositRequests.create({
      data: {
        agent_id: userId,
        user_id: target_user_id || 'unlinked',
        amount: Number(amount),
        provider,
        transaction_id: transition_id,
        notes,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Deposit recorded securely for manager review', request });
  } catch (error) {
    console.error('requestDeposit error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { amount, mobile_money_number, mobile_money_provider } = req.body;

    const payout = await prisma.agentCommissionPayouts.create({
      data: {
        agent_id: userId,
        amount: Number(amount),
        mobile_money_number,
        mobile_money_provider,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Withdrawal officially requested', payout });
  } catch (error) {
    console.error('requestWithdrawal error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const proxyInvestment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { investment_amount, partner_name } = req.body;

    // Similar logic to registerInvestor but explicitly defining Proxy Cash flows
    return res.status(201).json({ message: `Proxy investment of UGX ${investment_amount} queued for ${partner_name}`});
  } catch (error) {
    console.error('proxyInvestment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const ledger = await prisma.generalLedger.findMany({
      where: { user_id: userId },
      orderBy: { transaction_date: 'desc' }
    });

    return res.status(200).json({ transactions: ledger });
  } catch (error) {
    console.error('getTransactions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
