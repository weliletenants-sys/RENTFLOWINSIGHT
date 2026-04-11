import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const requestDeposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { target_user_id, amount, provider, transition_id, notes, deposit_type } = req.body;
    const depositAmount = Number(amount);

    if (depositAmount <= 0) {
      return res.status(400).json({
        type: 'https://api.welile.com/errors/bad-request',
        title: 'Invalid Amount',
        status: 400,
        detail: 'Deposit amount must be greater than zero.',
        instance: req.originalUrl
      });
    }

    const now = new Date().toISOString();
    const effectiveTargetId = target_user_id || userId;
    const isSelfDeposit = effectiveTargetId === userId;

    // Conditionally deduct from Agent Wallet if depositing on behalf of a tenant or partner
    if (!isSelfDeposit) {
      const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
      if (!wallet || wallet.balance < depositAmount) {
        return res.status(400).json({
          type: 'https://api.welile.com/errors/payment-required',
          title: 'Insufficient Funds',
          status: 400,
          detail: 'Insufficient wallet balance to fund this user request.',
          instance: req.originalUrl
        });
      }

      await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { decrement: depositAmount }, updated_at: now }
      });
      
      await prisma.generalLedger.create({
        data: {
          user_id: userId,
          amount: depositAmount,
          direction: 'cash_out',
          category: 'wallet_transfer',
          source_table: 'wallets',
          transaction_date: now,
          created_at: now,
          description: `Internal transfer deduction to fund deposit request for user ${effectiveTargetId}`
        }
      });
    }

    const request = await prisma.depositRequests.create({
      data: {
        agent_id: userId,
        user_id: effectiveTargetId,
        amount: depositAmount,
        provider,
        transaction_id: transition_id,
        notes: notes || `Deposit Type: ${deposit_type || 'float'}`,
        status: 'PENDING',
        created_at: now,
        updated_at: now
      }
    });

    // Auto-approve floats for now if they are simple mobile money integrations
    // Or we rely on the CFO to approve. If approved, we will route to 'agent_float_deposit'
    // or direct 'rent_repayment' flow bypasses wallet entirely.

    const executives = await prisma.profiles.findMany({
      where: { role: { in: ['COO', 'CFO'] } }
    });
    
    if (executives.length > 0) {
      await prisma.notifications.createMany({
        data: executives.map(exec => ({
          user_id: exec.id,
          title: 'New Agent Deposit Request',
          message: `Agent ${userId} requested a deposit of UGX ${amount} for User ${target_user_id || 'unlinked'}.`,
          type: 'DEPOSIT_REQUEST',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      });
    }

    return res.status(201).json({ message: 'Deposit recorded securely for manager review', request });
  } catch (error) {
    console.error('requestDeposit error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    // Match frontend fields: method, recipient_number, provider, reference
    const { amount, method, recipient_number, provider, reference } = req.body;
    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      return res.status(400).json({
        type: 'https://api.welile.com/errors/bad-request',
        title: 'Invalid Request',
        status: 400,
        detail: 'Invalid withdrawal amount',
        instance: req.originalUrl
      });
    }

    // Calculate Commission Balance strictly
    const commissionEntries = await prisma.generalLedger.findMany({
      where: {
        user_id: userId,
        category: { in: ['agent_commission_earned', 'agent_commission_paid', 'agent_commission_used_for_rent'] }
      }
    });
    
    let commissionBalance = 0;
    for (const entry of commissionEntries) {
      if (entry.direction === 'cash_in') commissionBalance += entry.amount;
      else commissionBalance -= entry.amount;
    }

    if (commissionBalance < withdrawalAmount) {
      return res.status(400).json({
        type: 'https://api.welile.com/errors/payment-required',
        title: 'Insufficient Commission',
        status: 400,
        detail: 'Insufficient commission balance to perform this withdrawal. Float cannot be withdrawn.',
        instance: req.originalUrl
      });
    }

    const now = new Date().toISOString();

      // 1. Commission doesn't rely strictly on wallets table anymore for validation, but we can decrement it
      // if wallet still aggregates all funds for backwards compatibility.
      prisma.wallets.updateMany({
        where: { user_id: userId },
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
      // 3. Append to General Ledger as explicitly commission paid
      prisma.generalLedger.create({
        data: {
          user_id: userId,
          amount: withdrawalAmount,
          direction: 'cash_out',
          category: 'agent_commission_paid', // CRITICAL: using new category explicitly
          source_table: 'agent_commission_payouts',
          transaction_date: now,
          created_at: now,
        }
      })
    ]);

    return res.status(201).json({ message: 'Withdrawal officially requested', payout });
  } catch (error) {
    console.error('requestWithdrawal error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const proxyInvestment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { investment_amount, partner_name } = req.body;

    // Similar logic to registerInvestor but explicitly defining Proxy Cash flows
    return problemResponse(res, 201, 'Error', `Proxy investment of UGX ${investment_amount} queued for ${partner_name}`, 'error');
  } catch (error) {
    console.error('proxyInvestment error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const ledger = await prisma.generalLedger.findMany({
      where: { user_id: userId },
      orderBy: { transaction_date: 'desc' }
    });

    return res.status(200).json({ transactions: ledger });
  } catch (error) {
    console.error('getTransactions error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};
