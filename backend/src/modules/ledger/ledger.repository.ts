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
  /**
   * Insert a ledger entry using an interactive Prisma transaction client, ensuring atomicity.
   * STRICT ENFORCEMENT: The ledger is the only source of truth. Wallets are mathematical derivatives 
   * of ledger entries therefore the postgreSQL DB Trigger organically mutates them inherently.
   */
  async createEntry(tx: TransactionClient, payload: LedgerEntryPayload) {
    if (payload.amount < 0) throw new Error("Ledger Entry Validation Failure: Amounts must be absolutely positive values.");
    
    // Explicitly parse entry_type cleanly (debit/credit mapping for legacy cash_in/cash_out)
    let formalEntryType = payload.entryType;
    if (payload.entryType === 'cash_in') formalEntryType = 'credit';
    if (payload.entryType === 'cash_out') formalEntryType = 'debit';

    // Force the Ledger Truth Table logic perfectly
    const entry = await tx.generalLedger.create({
      data: {
        amount: payload.amount,
        entry_type: formalEntryType,
        category: payload.category,
        description: payload.description,
        source_id: payload.sourceId,
        source_table: payload.sourceTable || 'unknown',
        transaction_id: payload.transactionId,
        account_id: payload.accountId || 'system',
      }
    });

    return entry;
  }
}
