import prisma from '../prisma/prisma.client';
import { LedgerService } from '../modules/ledger/ledger.service';
import { v4 as uuidv4 } from 'uuid';

const ledgerService = new LedgerService();

export class WalletService {
  /**
   * Fetch wallet and ledger transactions exclusively from V2 Accounts/Entries
   */
  static async getWalletDetails(userId: string) {
    let wallet = await prisma.financialAccounts.findFirst({
      where: { user_id: userId, type: 'WALLET' },
    });

    if (!wallet) {
      wallet = await prisma.financialAccounts.create({
        data: {
          id: userId,
          user_id: userId,
          type: 'WALLET',
          balance: 0,
          currency: 'UGX',
          created_at: new Date()
        }
      });
    }

    // Retrieve ledger entries from the strictly true financial entries
    const entries = await prisma.financialEntries.findMany({
      where: { account_id: wallet.id },
      include: { transaction: true },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    // Remap to match legacy frontend expectations seamlessly while leveraging V2 backend truth
    const formattedLedger = entries.map(e => ({
       id: e.id,
       amount: e.type === 'CREDIT' ? e.amount : -e.amount,
       direction: e.type === 'CREDIT' ? 'cash_in' : 'cash_out',
       category: (e.transaction.metadata as any)?.category,
       description: e.transaction.reference,
       created_at: e.created_at
    }));

    return {
      id: wallet.id,
      account_id: wallet.user_id,
      balance: wallet.balance,
      currency: wallet.currency,
      ledger: formattedLedger
    };
  }

  /**
   * Core deposit logic (Atomic V2 Idempotent Ledger Pipeline)
   */
  static async deposit(userId: string, amount: number) {
    const wallet = await prisma.financialAccounts.findFirst({ where: { user_id: userId, type: 'WALLET' } });
    if (!wallet) throw new Error('Wallet not found');

    const result = await ledgerService.transferWithIdempotency({
       idempotencyKey: `DEP_${uuidv4()}`,
       fromAccountId: 'SYS_PLATFORM_WALLET_DEPOSIT', // Auto-provisions internal account
       toAccountId: wallet.id,
       amount: amount,
       category: 'wallet_deposit',
       description: 'Mobile Money / Direct Deposit into Physical Wallet',
       sourceTable: 'deposit_requests'
    }, { id: 'SYSTEM', role: 'SUPER_ADMIN', scopes: ['ledger.transfer.execute'] });

    return { status: 'success', transaction: result };
  }

  /**
   * Core withdrawal logic
   */
  static async withdraw(userId: string, amount: number) {
    const wallet = await prisma.financialAccounts.findFirst({ where: { user_id: userId, type: 'WALLET' } });
    if (!wallet) throw new Error('Wallet not found');

    if (wallet.balance < amount) {
      throw new Error('Insufficient funds. Withdrawal violates minimum ledger balance laws.');
    }

    const result = await ledgerService.transferWithIdempotency({
       idempotencyKey: `WTH_${uuidv4()}`,
       fromAccountId: wallet.id,
       toAccountId: 'SYS_PLATFORM_WALLET_WITHDRAWAL', // Internal accounting sink
       amount: amount,
       category: 'wallet_withdrawal',
       description: 'Approved Wallet Cash Out Request',
       sourceTable: 'investment_withdrawal_requests'
    }, { id: 'SYSTEM', role: 'SUPER_ADMIN', scopes: ['ledger.transfer.execute'] });

    return { status: 'success', transaction: result };
  }

  /**
   * Core transfer logic (Internal Wallet-to-Wallet via Idempotent Pipeline)
   */
  static async transfer(senderId: string, recipientId: string, amount: number) {
    const senderWallet = await prisma.financialAccounts.findFirst({ where: { user_id: senderId, type: 'WALLET' } });
    const recipientWallet = await prisma.financialAccounts.findFirst({ where: { user_id: recipientId, type: 'WALLET' } });

    if (!senderWallet) throw new Error('Sender wallet not found');
    if (!recipientWallet) throw new Error('Recipient wallet not found');

    if (senderWallet.balance < amount) {
      throw new Error('Insufficient funds for internal ledger transfer');
    }

    const result = await ledgerService.transferWithIdempotency({
       idempotencyKey: `TRX_${uuidv4()}`,
       fromAccountId: senderWallet.id,
       toAccountId: recipientWallet.id,
       amount: amount,
       category: 'wallet_transfer',
       description: 'Internal Peer-to-Peer Transfer',
       sourceTable: 'financial_accounts'
    }, { id: 'SYSTEM', role: 'SUPER_ADMIN', scopes: ['ledger.transfer.execute'] });

    return { status: 'success', transactionId: result.transaction_id };
  }

  /**
   * Request a deposit manually
   */
  static async requestDeposit(userId: string, amount: number, provider: string, transactionId: string, notes?: string) {
    const depositRequest = await prisma.depositRequests.create({
      data: {
        account_id: userId, // Legacy reference preservation, no ledger binding needed here
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
          account_id: exec.id,
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
