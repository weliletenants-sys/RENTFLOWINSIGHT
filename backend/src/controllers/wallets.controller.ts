import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const wallet = await prisma.wallets.findFirst({
      where: { user_id: userId },
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    return res.status(200).json(wallet);
  } catch (error) {
    console.error('Get wallet error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const transfer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount, recipientId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!amount || amount <= 0 || !recipientId) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }

    const senderWallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    const recipientWallet = await prisma.wallets.findFirst({ where: { user_id: recipientId } });

    if (!senderWallet) return res.status(404).json({ message: 'Sender wallet not found' });
    if (!recipientWallet) return res.status(404).json({ message: 'Recipient wallet not found' });

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds for transfer' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};
