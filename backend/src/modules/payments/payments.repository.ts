import prisma from '../../prisma/prisma.client';
import { LedgerService } from '../ledger/ledger.service';
import { WalletsService } from '../wallets/wallets.service';
import { v4 as uuidv4 } from 'uuid';
import { withTransactionRetry } from '../../shared/utils/transaction.util';

export class PaymentsRepository {
  private ledgerService = new LedgerService();
  private walletsService = new WalletsService();

  /**
   * Executes the rent payment flow entirely within a single atomic PostgreSQL transaction.
   * This handles the BEGIN/COMMIT/ROLLBACK implicitly.
   */
  async executeRentPaymentTransaction(payload: {
    agentId: string;
    amount: number;
    reference: string;
    tenantId: string;
  }) {
    // 1. Initial lookup to prevent duplicating work if already mapped accurately
    const existingSync = await prisma.ledgerTransactions.findUnique({
      where: { idempotency_key: payload.reference }
    });

    if (existingSync) {
      console.log(`[IDEMPOTENT HIT] Rent Payment event ${payload.reference} already successfully mapped.`);
      return {
        success: true,
        transactionGroupId: existingSync.id,
        agentClosingBalance: null // Idempotent hits shouldn't strictly require live wallet pulls natively here unless requested.
      };
    }

    // 2. Map resilient creation logic executing strict bounds natively
    return withTransactionRetry(prisma, async (tx) => {
      // 3. Construct the Master Event Node explicitly mapping PostgreSQL Unique Constraint P2002 locks natively!
      const event = await tx.ledgerTransactions.create({
          data: {
              idempotency_key: payload.reference,
              category: 'rent_payment',
              created_at: new Date().toISOString(),
              source_table: 'rent_requests',
              initiated_by: payload.agentId
          }
      });

      // 4. Lock and Debit Agent's Wallet
      const agentWallet = await this.walletsService.processLedgerEffect(
        tx, payload.agentId, payload.amount, false, 
        event.id, null, 'agent', payload.agentId
      );
      if (agentWallet.balance < 0) {
        throw new Error('Insufficient Funds: Agent wallet cannot drop below 0.');
      }

      // 5. Credit System Wallet (System is represented by 'system')
      await this.walletsService.processLedgerEffect(
        tx, 'system', payload.amount, true, 
        event.id, null, 'agent', payload.agentId
      );

      // 6. Create Ledger Entries structurally bound perfectly to the Master Event Node
      await this.ledgerService.recordDoubleEntry(tx, 
        {
          amount: payload.amount,
          category: 'rent_payment',
          description: `Rent payment collected from tenant ${payload.tenantId}`,
          userId: payload.agentId,
          sourceTable: 'rent_requests',
          transactionGroupId: event.id,
          referenceId: payload.reference // Safe mapped tracking natively
        },
        {
          amount: payload.amount,
          category: 'rent_collection',
          description: `System collection received from Agent ${payload.agentId} for tenant ${payload.tenantId}`,
          userId: 'system',
          sourceTable: 'rent_requests',
          transactionGroupId: event.id,
          referenceId: payload.reference 
        }
      );

      return {
        success: true,
        transactionGroupId: event.id,
        agentClosingBalance: agentWallet.balance
      };
    });
  }
}
