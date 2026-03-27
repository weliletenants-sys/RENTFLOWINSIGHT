import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id; // Allow dual role support
    if (!userId) {
      return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    }

    let wallet = await prisma.wallets.findFirst({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await prisma.wallets.create({
        data: {
          user_id: userId,
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }

    // Extended Section: Extract mathematically-tracked Wallet Transactions (Triple-State Ledger)
    const transactions = await prisma.walletTransactions.findMany({
      where: {
        OR: [{ sender_id: userId }, { recipient_id: userId }],
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    return res.status(200).json({
       ...wallet,
       ledger: transactions.map((t) => ({
          ...t,
          type: t.sender_id === userId ? 'DEBIT' : 'CREDIT'
       }))
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { amount } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0) return problemResponse(res, 400, 'Validation Error', `Invalid amount`, 'validation-error');

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return problemResponse(res, 404, 'Not Found', `Wallet not found`, 'not-found');

    const now = new Date().toISOString();
    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance + amount;

    const [updatedWallet, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: 'Wallet Deposit',
          recipient_id: userId,
          created_at: now
        }
      })
    ]);

    return res.status(200).json({ message: 'Deposit successful', wallet: updatedWallet });
  } catch (error) {
    console.error('Deposit error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { amount } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0) return problemResponse(res, 400, 'Validation Error', `Invalid amount`, 'validation-error');

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return problemResponse(res, 404, 'Not Found', `Wallet not found`, 'not-found');

    if (wallet.balance < amount) {
      return problemResponse(res, 400, 'Validation Error', `Insufficient funds`, 'validation-error');
    }

    const now = new Date().toISOString();
    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance - amount;

    const [updatedWallet, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: 'Wallet Withdrawal',
          sender_id: userId,
          created_at: now
        }
      })
    ]);

    return res.status(200).json({ message: 'Withdrawal successful', wallet: updatedWallet });
  } catch (error) {
    console.error('Withdraw error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const transfer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { amount, recipientId } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0 || !recipientId) {
      return problemResponse(res, 400, 'Validation Error', `Invalid transfer details`, 'validation-error');
    }

    const senderWallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    const recipientWallet = await prisma.wallets.findFirst({ where: { user_id: recipientId } });

    if (!senderWallet) return problemResponse(res, 404, 'Not Found', `Sender wallet not found`, 'not-found');
    if (!recipientWallet) return problemResponse(res, 404, 'Not Found', `Recipient wallet not found`, 'not-found');

    if (senderWallet.balance < amount) {
      return problemResponse(res, 400, 'Validation Error', `Insufficient funds for transfer`, 'validation-error');
    }

    const now = new Date().toISOString();
    
    // Explicit Triple-State Tracking
    const senderBefore = senderWallet.balance;
    const senderAfter = senderWallet.balance - amount;
    
    const receiverBefore = recipientWallet.balance;
    const receiverAfter = recipientWallet.balance + amount;

    const [updatedSenderWallet, updatedRecipientWallet, tx1, tx2] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: senderWallet.id },
        data: { balance: senderAfter, updated_at: now }
      }),
      prisma.wallets.update({
        where: { id: recipientWallet.id },
        data: { balance: receiverAfter, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
          balance_before: senderBefore,
          balance_after: senderAfter,
          description: 'Wallet Transfer Sent',
          sender_id: userId,
          recipient_id: recipientId,
          created_at: now
        }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
          balance_before: receiverBefore,
          balance_after: receiverAfter,
          description: 'Wallet Transfer Received',
          sender_id: userId, // Logged as originating from sender
          recipient_id: recipientId,
          created_at: now
        }
      })
    ]);

    return res.status(200).json({ message: 'Transfer successful', wallet: updatedSenderWallet });
  } catch (error) {
    console.error('Transfer error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const requestDeposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { amount, provider, transactionId, notes } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0 || !transactionId) {
      return problemResponse(res, 400, 'Validation Error', `Invalid payload. Requires amount and transactionId`, 'validation-error');
    }

    const depositRequest = await prisma.depositRequests.create({
      data: {
        user_id: userId,
        amount,
        provider: provider || 'MOBILE_MONEY',
        transaction_id: transactionId,
        status: 'pending',
        notes: notes || null,
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const executives = await prisma.profiles.findMany({
      where: { role: { in: ['COO', 'CFO'] } }
    });
    
    if (executives.length > 0) {
      await prisma.notifications.createMany({
        data: executives.map(exec => ({
          user_id: exec.id,
          title: 'New Deposit Request',
          message: `User ${userId} has requested a deposit of UGX ${amount}.`,
          type: 'DEPOSIT_REQUEST',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      });
    }

    return res.status(201).json({ message: 'Deposit request submitted for manager approval', depositRequest });
  } catch (error) {
    console.error('Deposit Request Error:', error);
    problemResponse(res, 500, 'Internal Server Error', `Internal Server Error`, 'internal-server-error');
  }
};
