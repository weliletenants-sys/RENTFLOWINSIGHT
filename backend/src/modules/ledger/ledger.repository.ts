import { Prisma, PrismaClient } from '@prisma/client';

export type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export interface LedgerEntryPayload {
  description?: string;
  direction: 'cash_in' | 'cash_out';
  amount: number;
  category: string;
  sourceTable?: string;
  sourceId?: string;
  userId?: string;
  transactionGroupId: string;
}

export class LedgerRepository {
  /**
   * Insert a ledger entry using an interactive Prisma transaction client, ensuring atomicity.
   * STRICT ENFORCEMENT: The ledger is the only source of truth. Wallets are mathematical derivatives 
   * of ledger entries therefore this transaction actively updates and provisions the linked wallet recursively.
   */
  async createEntry(tx: TransactionClient, payload: LedgerEntryPayload) {
    if (payload.amount < 0) throw new Error("Ledger Entry Validation Failure: Amounts must be absolutely positive values.");
    
    const now = new Date().toISOString();
    
    // 1. Force the Ledger Truth Table logic perfectly
    const entry = await tx.generalLedger.create({
      data: {
        amount: payload.amount,
        direction: payload.direction,
        category: payload.category,
        description: payload.description,
        source_id: payload.sourceId,
        source_table: payload.sourceTable || 'unknown',
        transaction_group_id: payload.transactionGroupId,
        user_id: payload.userId,
        transaction_date: now,
        created_at: now
      }
    });

    // 2. Mathematically Trigger the Wallet derivative based strictly off the Entry definition
    if (payload.userId) {
      // Calculate delta conceptually
      const delta = payload.direction === 'cash_in' ? payload.amount : -payload.amount;
      
      // Upsert logic natively enforcing initialization if empty before incrementation
      await tx.wallets.upsert({
        where: { user_id: payload.userId },
        create: {
          user_id: payload.userId,
          balance: delta,
          created_at: now,
          updated_at: now
        },
        update: {
          balance: { increment: delta },
          updated_at: now
        }
      });
      
      // Prevent negative balances fundamentally across the platform for derived wallets if needed,
      // but since 'wallets' is derived we can explicitly query to protect against impossible states
      const lockedWallet = await tx.wallets.findFirst({
        where: { user_id: payload.userId }
      });
      if (lockedWallet && lockedWallet.balance < 0 && payload.userId !== 'system') {
         // The system wallet is technically capable of running negative depending on the macro setup, but standard users cannot drop below zero.
         throw new Error(`[LEDGER INTEGRITY FAILURE] Wallet evaluation for user ${payload.userId} dropped below 0. Transaction violently aborted.`);
      }
    }

    return entry;
  }
}
