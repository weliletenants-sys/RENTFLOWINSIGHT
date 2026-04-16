import { Prisma, PrismaClient } from '@prisma/client';

export type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export interface LedgerEntryPayload {
  description?: string;
  entryType: 'cash_in' | 'cash_out' | 'debit' | 'credit'; // Preserving backward compat types temporarily if downstream fails
  amount: number;
  category: string;
  sourceTable?: string;
  sourceId?: string;
  accountId?: string;
  transactionId: string;
}

export class LedgerRepository {
  async createEntry(tx: TransactionClient, payload: LedgerEntryPayload) {
    throw new Error("FATAL: LedgerRepository.createEntry is DEPRECATED. V1 general_ledger is frozen. Use LedgerService.recordDoubleEntry for atomic V2 financial ledger insertions.");
  }
}
