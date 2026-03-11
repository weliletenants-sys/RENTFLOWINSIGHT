import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getMyWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        credits: { orderBy: { createdAt: 'desc' }, take: 20 },
        debits: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  // Core Double Entry Logic
  async processTransaction(data: {
    userId: string;
    amount: number;
    type: TransactionType;
    reference: string;
    description: string;
  }) {
    // We use Prisma transactions to lock and ensure both entries succeed OR fail together
    return this.prisma.$transaction(async (tx) => {
      
      const wallet = await tx.wallet.findUnique({ where: { userId: data.userId }});
      if (!wallet) throw new NotFoundException('Wallet not found');

      // Debit validation
      if (data.amount < 0 && Number(wallet.balance) < Math.abs(data.amount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      // Update balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: data.amount } }
      });

      // Record ledger entry
      const transaction = await tx.transaction.create({
        data: {
          amount: data.amount,
          type: data.type,
          referenceId: data.reference,
          description: data.description,
          creditWallet: { connect: { id: wallet.id } },
          debitWallet: { connect: { id: wallet.id } }, // Self connection for simple single-entry adjustments
        }
      });

      return { wallet: updatedWallet, transaction };
    });
  }
}
