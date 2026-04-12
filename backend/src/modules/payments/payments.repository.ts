import prisma from '../../prisma/prisma.client';
import { LedgerRepository, TransactionClient } from '../ledger/ledger.repository';
import { withTransactionRetry } from '../../shared/utils/transaction.util';
import { v4 as uuidv4 } from 'uuid';

export interface ExecutePaymentConfig {
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  idempotencyKey: string;
  metadata: Record<string, any>;
  afterLedgerWrite: (tx: TransactionClient, transactionId: string, paymentId: string) => Promise<void>;
}

export class PaymentsRepository {
  private ledgerRepo = new LedgerRepository();

  /**
   * Universal Financial Execution Engine.
   * Completely domain agnostic. It establishes the Atom lock, performs exact duplicate rejection, 
   * maps double-entry pairs cleanly, allows Domain Writes sequentially, and emits to Outbox securely.
   */
  async executeFinancialTransaction(config: ExecutePaymentConfig) {
    // 1. Enforce Idempotency Graphically
    const existingSync = await prisma.ledgerTransactions.findUnique({
      where: { idempotency_key: config.idempotencyKey }
    });

    if (existingSync) {
      console.log(`[IDEMPOTENT HIT] Payment event ${config.idempotencyKey} completely skipped gracefully.`);
      return {
        success: true,
        transactionId: existingSync.id,
      };
    }

    // 2. Strict Atom Wrapper
    return withTransactionRetry(prisma, async (tx) => {
      
      // 3. Construct the Master Event Node
      const event = await tx.ledgerTransactions.create({
          data: {
              idempotency_key: config.idempotencyKey,
              category: config.metadata.type || 'generic_payment',
              created_at: new Date().toISOString(),
              source_table: 'external',
              initiated_by: config.metadata.paid_by || 'system'
          }
      });
      const paymentId = event.id;
      const transactionId = event.id; // Group ID identical natively

      // 4. Ledger Core Isolation (Write Double Entry)
      
      // Debit Entry (out)
      await this.ledgerRepo.createEntry(tx, {
          amount: config.amount,
          entryType: 'debit',
          category: config.metadata.type || 'generic_payment',
          description: `Debit resolution for ${config.metadata.type || 'generic operation'}`,
          accountId: config.debitAccountId,
          sourceTable: 'ledger_transactions',
          transactionId: transactionId,
          sourceId: config.idempotencyKey
      });

      // Credit Entry (in)
      await this.ledgerRepo.createEntry(tx, {
          amount: config.amount,
          entryType: 'credit',
          category: config.metadata.type || 'generic_payment',
          description: `Credit allocation for ${config.metadata.type || 'generic operation'}`,
          accountId: config.creditAccountId,
          sourceTable: 'ledger_transactions',
          transactionId: transactionId,
          sourceId: config.idempotencyKey
      });

      // 5. Execute Highly Scoped Domain Writes (Strict DB isolation required)
      await config.afterLedgerWrite(tx, transactionId, paymentId);
      
      // 6. Push Event Data to Transactional Outbox
      await tx.outboxEvents.create({
        data: {
            event_type: `${config.metadata.type}.created`,
            payload: {
                paymentId,
                transactionId,
                debitAccountId: config.debitAccountId,
                creditAccountId: config.creditAccountId,
                amount: config.amount,
                timestamp: new Date().toISOString(),
                ...config.metadata
            }
        }
      });

      return {
        success: true,
        transactionId,
        paymentId
      };
    });
  }
}

