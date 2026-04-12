import prisma from '../../prisma/prisma.client';
import { LedgerRepository } from '../ledger/ledger.repository';
// WalletsRepository IMPORT REMOVED: Ledger strictly handles Wallet mutation limits internally natively.
import { withTransactionRetry } from '../../shared/utils/transaction.util';

export class PaymentsRepository {
  private ledgerRepo = new LedgerRepository();

  /**
   * Executes the rent payment flow entirely within a single atomic PostgreSQL transaction.
   * This handles the BEGIN/COMMIT/ROLLBACK implicitly. Data Access ONLY.
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
      };
    }

    // 2. Map resilient creation logic executing strict bounds natively
    return withTransactionRetry(prisma, async (tx) => {
      // 3. Construct the Master Event Node explicitly mapping PostgreSQL Unique Constraint natively
      const event = await tx.ledgerTransactions.create({
          data: {
              idempotency_key: payload.reference,
              category: 'rent_payment',
              created_at: new Date().toISOString(),
              source_table: 'rent_requests',
              initiated_by: payload.agentId
          }
      });

      // 4. Create Ledger Entries structurally bound perfectly to the Master Event Node.
      // NOTE: "Legder -> trigger -> wallet" logic means creating these ledger entries immediately
      // and algorithmically updates the respective Wallets tied to these userIds.

      // Debit Entry (out from Agent)
      await this.ledgerRepo.createEntry(tx, {
          amount: payload.amount,
          direction: 'cash_out',
          category: 'rent_payment',
          description: `Rent payment collected from tenant ${payload.tenantId}`,
          userId: payload.agentId,
          sourceTable: 'rent_requests',
          transactionGroupId: event.id,
          sourceId: payload.reference 
      });

      // Credit Entry (in to System)
      await this.ledgerRepo.createEntry(tx, {
          amount: payload.amount,
          direction: 'cash_in',
          category: 'rent_collection',
          description: `System collection received from Agent ${payload.agentId} for tenant ${payload.tenantId}`,
          userId: 'system', // Target the system wallet explicitly
          sourceTable: 'rent_requests',
          transactionGroupId: event.id,
          sourceId: payload.reference 
      });

      return {
        success: true,
        transactionGroupId: event.id
      };
    });
  }
}

