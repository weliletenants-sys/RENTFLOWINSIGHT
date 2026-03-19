import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    }

    const wallet = await prisma.wallets.findFirst({
      where: { user_id: userId },
    });

    if (!wallet) {
      return problemResponse(res, 404, 'Not Found', `Wallet not found`, 'not-found');
    }

    return res.status(200).json(wallet);
  } catch (error) {
    console.error('Get wallet error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0) return problemResponse(res, 400, 'Validation Error', `Invalid amount`, 'validation-error');

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return problemResponse(res, 404, 'Not Found', `Wallet not found`, 'not-found');

    const now = new Date().toISOString();

    const [updatedWallet, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount }, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
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
    const userId = req.user?.sub;
    const { amount } = req.body;

    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');
    if (!amount || amount <= 0) return problemResponse(res, 400, 'Validation Error', `Invalid amount`, 'validation-error');

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return problemResponse(res, 404, 'Not Found', `Wallet not found`, 'not-found');

    if (wallet.balance < amount) {
      return problemResponse(res, 400, 'Validation Error', `Insufficient funds`, 'validation-error');
    }

    const now = new Date().toISOString();

    const [updatedWallet, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount }, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
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
    const userId = req.user?.sub;
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

    const [updatedSenderWallet, updatedRecipientWallet, tx] = await prisma.$transaction([
      prisma.wallets.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount }, updated_at: now }
      }),
      prisma.wallets.update({
        where: { id: recipientWallet.id },
        data: { balance: { increment: amount }, updated_at: now }
      }),
      prisma.walletTransactions.create({
        data: {
          amount,
          description: 'Wallet Transfer',
          sender_id: userId,
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
    const userId = req.user?.sub;
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

    return res.status(201).json({ message: 'Deposit request submitted for manager approval', depositRequest });
  } catch (error) {
    console.error('Deposit Request Error:', error);
    problemResponse(res, 500, 'Internal Server Error', `Internal Server Error`, 'internal-server-error');
  }
};
