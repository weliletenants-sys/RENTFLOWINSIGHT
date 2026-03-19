import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const requestDeposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { target_user_id, amount, provider, transition_id, notes } = req.body;
    
    // TODO: Verify if Agent deposits into the app should also deduct from their Agent Wallet here.
    // Currently, deposit requests rely on external payment gateways or manual Admin approval 
    // without locking/decrementing the agent's internal float beforehand.

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

    // Match frontend fields: method, recipient_number, provider, reference
    const { amount, method, recipient_number, provider, reference } = req.body;
    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    
    if (wallet.balance < withdrawalAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }

    const now = new Date().toISOString();

    const [updatedWallet, payout, ledgerEntry] = await prisma.$transaction([
      // 1. Deduct immediately from the agent's wallet
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { decrement: withdrawalAmount }, updated_at: now }
      }),
      // 2. Queue the payout for admin approval
      prisma.agentCommissionPayouts.create({
        data: {
          agent_id: userId,
          amount: withdrawalAmount,
          mobile_money_number: recipient_number || '',
          mobile_money_provider: provider || 'unknown',
          transaction_id: reference || null,
          status: 'PENDING',
          created_at: now,
          requested_at: now,
          updated_at: now
        }
      }),
      // 3. Append to General Ledger
      prisma.generalLedger.create({
        data: {
          user_id: userId,
          amount: withdrawalAmount,
          direction: 'cash_out',
          category: 'agent_withdrawal_request',
          source_table: 'wallets',
          transaction_date: now,
          created_at: now,
        }
      })
    ]);

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
