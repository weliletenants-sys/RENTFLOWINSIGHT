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
   */
  async createEntry(tx: TransactionClient, payload: LedgerEntryPayload) {
    const now = new Date().toISOString();
    return tx.generalLedger.create({
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
  }
}
