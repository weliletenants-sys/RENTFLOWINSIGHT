import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
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
