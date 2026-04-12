import prisma from '../prisma/prisma.client';
import { v4 as uuidv4 } from 'uuid';

export interface LedgerTransactionPayload {
  accountType?: string;
  amount: number;
  category: string;
  description?: string;
  direction: 'cash_in' | 'cash_out';
  linkedParty?: string;
  sourceId?: string;
  sourceTable: string;
  transactionGroupId?: string;
  userId?: string;
  roleType?: string;
  scope?: 'wallet' | 'platform' | 'bridge';
}

export class TransactionService {
  /**
   * The single source of truth for ALL financial movement on the platform.
   * Inserts the entry into general_ledger. 
   * It is strictly FORBIDDEN to update the wallet balance explicitly. The database trigger updates it.
   */
  static async createLedgerTransaction(payload: LedgerTransactionPayload) {
    const now = new Date().toISOString();
    
    // Group transaction ID for atomic linking of multi-ledger posts (e.g., transfers)
    const txGroupId = payload.transactionGroupId || uuidv4();

    const ledgerEntry = await prisma.generalLedger.create({
      data: {
        account_type: payload.accountType,
        amount: payload.amount,
        category: payload.category,
        description: payload.description,
        direction: payload.direction,
        linked_party: payload.linkedParty,
        source_id: payload.sourceId,
        source_table: payload.sourceTable,
        transaction_date: now,
        created_at: now,
        transaction_group_id: txGroupId,
        user_id: payload.userId,
        role_type: payload.roleType,
        scope: payload.scope || 'wallet',
      }
    });

    return ledgerEntry;
  }
}
