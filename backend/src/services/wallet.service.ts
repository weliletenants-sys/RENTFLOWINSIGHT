import prisma from '../prisma/prisma.client';
import { TransactionService } from './transaction.service';
import { v4 as uuidv4 } from 'uuid';

export class WalletService {
  /**
   * Fetch wallet and ledger transactions
   */
  static async getWalletDetails(userId: string) {
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

    // Retrieve ledger entries from general_ledger instead of walletTransactions
    const transactions = await prisma.generalLedger.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    return {
      ...wallet,
      ledger: transactions
    };
  }

  /**
   * Core deposit logic (Appends to double-entry ledger only)
   */
  static async deposit(userId: string, amount: number) {
    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) throw new Error('Wallet not found');

    const ledgerEntry = await TransactionService.createLedgerTransaction({
      amount,
      category: 'wallet_deposit',
      description: 'Wallet Deposit',
      direction: 'cash_in',
      sourceTable: 'deposit_requests',
      userId: userId,
      scope: 'wallet'
    });

    // We do NOT return the updated wallet because the trigger handles it lazily,
    // so we return the transaction reference which is safely verified.
    return { status: 'success', transaction: ledgerEntry };
  }

  /**
   * Core withdrawal logic
   */
  static async withdraw(userId: string, amount: number) {
    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet) throw new Error('Wallet not found');

    if (wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    const ledgerEntry = await TransactionService.createLedgerTransaction({
      amount,
      category: 'wallet_withdrawal',
      description: 'Wallet Withdrawal',
      direction: 'cash_out',
      sourceTable: 'investment_withdrawal_requests', // Example source
      userId: userId,
      scope: 'wallet'
    });

    return { status: 'success', transaction: ledgerEntry };
  }

  /**
   * Core transfer logic (Internal Wallet-to-Wallet)
   */
  static async transfer(senderId: string, recipientId: string, amount: number) {
    const senderWallet = await prisma.wallets.findFirst({ where: { user_id: senderId } });
    const recipientWallet = await prisma.wallets.findFirst({ where: { user_id: recipientId } });

    if (!senderWallet) throw new Error('Sender wallet not found');
    if (!recipientWallet) throw new Error('Recipient wallet not found');

    if (senderWallet.balance < amount) {
      throw new Error('Insufficient funds for transfer');
    }

    const groupedTxId = uuidv4();

    // The transfer creates two atomic entries in the general ledger
    const [senderEntry, recipientEntry] = await prisma.$transaction([
      prisma.generalLedger.create({
        data: {
          amount,
          category: 'wallet_transfer',
          description: 'Transfer Sent',
          direction: 'cash_out',
          linked_party: recipientId,
          source_table: 'wallets', // Internal transfer
          transaction_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          transaction_group_id: groupedTxId,
          user_id: senderId,
          scope: 'wallet'
        }
      }),
      prisma.generalLedger.create({
        data: {
          amount,
          category: 'wallet_transfer',
          description: 'Transfer Received',
          direction: 'cash_in',
          linked_party: senderId,
          source_table: 'wallets',
          transaction_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          transaction_group_id: groupedTxId,
          user_id: recipientId,
          scope: 'wallet'
        }
      })
    ]);

    return { status: 'success', transactionId: groupedTxId };
  }

  /**
   * Request a deposit manually
   */
  static async requestDeposit(userId: string, amount: number, provider: string, transactionId: string, notes?: string) {
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

    return depositRequest;
  }
}
