import { LedgerRepository, LedgerEntryPayload, TransactionClient } from './ledger.repository';

export class LedgerService {
  private ledgerRepository: LedgerRepository;

  constructor() {
    this.ledgerRepository = new LedgerRepository();
  }

  /**
   * Records a strictly double-entry accounting transaction.
   * Both sides of the movement MUST balance inside the transaction.
   */
  async recordDoubleEntry(
    tx: TransactionClient, 
    debitPayload: Omit<LedgerEntryPayload, 'direction'>, 
    creditPayload: Omit<LedgerEntryPayload, 'direction'>
  ) {
    if (debitPayload.amount !== creditPayload.amount) {
      throw new Error("Ledger constraint violation: Debit and Credit amounts must match exactly.");
    }
    if (debitPayload.transactionGroupId !== creditPayload.transactionGroupId) {
      throw new Error("Ledger constraint violation: Linked entries must share the same transactionGroupId.");
    }

    const debitEntry = await this.ledgerRepository.createEntry(tx, {
      ...debitPayload,
      entry_type: 'debit' // Typically represents money leaving a source
    });

    const creditEntry = await this.ledgerRepository.createEntry(tx, {
      ...creditPayload,
      entry_type: 'credit' // Typically represents money entering a destination
    });

  }

  /**
   * Evaluates the absolute core physiological state of the monetary engine dynamically checking Wallet mappings against Ledger bounds.
   */
  async getSystemFinancialHealth() {
    const prisma = require('../../prisma/prisma.client').default;

    const ledgerIns = await prisma.generalLedger.aggregate({
      _sum: { amount: true },
      where: { entry_type: 'credit' }
    });
    const ledgerOuts = await prisma.generalLedger.aggregate({
      _sum: { amount: true },
      where: { entry_type: 'debit' }
    });

    const totalSystemIn = ledgerIns._sum.amount || 0;
    const totalSystemOut = ledgerOuts._sum.amount || 0;
    const totalLedgerBalance = totalSystemIn - totalSystemOut;

    const physicalWallets = await prisma.wallets.aggregate({
      _sum: { balance: true }
    });
    const totalWalletBalance = physicalWallets._sum.balance || 0;

    // Check for Duplicated Idempotency Keys natively (Event Level Isolation)
    const duplicates = await prisma.$queryRaw`
      SELECT idempotency_key, count(*) as count 
      FROM ledger_transactions 
      WHERE idempotency_key IS NOT NULL 
      GROUP BY idempotency_key 
      HAVING count(*) > 1
    ` as any[];

    const orphans = await prisma.$queryRaw`
      SELECT t.id 
      FROM ledger_transactions t
      LEFT JOIN general_ledger l ON t.id = l.reference_id
      WHERE l.id IS NULL
    ` as any[];

    return {
      wallet_vs_ledger_match: totalLedgerBalance === totalWalletBalance,
      total_wallet_balance: totalWalletBalance,
      total_ledger_balance: totalLedgerBalance,
      orphan_transactions: orphans.length,
      duplicate_idempotency_keys: duplicates.length,
      last_checked_at: new Date().toISOString()
    };
  }

  /**
   * Executes a strict atomic double-entry transfer guaranteed exactly-once via PostgreSQL idempotency lock.
   */
  async transferWithIdempotency(
    payload: {
      idempotencyKey: string;
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      category: string;
      description?: string;
      sourceTable?: string;
      sourceId?: string;
    },
    actor: { id: string; role: string; scopes: string[] }
  ) {
    if (!actor.scopes.includes('ledger.transfer.execute') && actor.role !== 'SUPER_ADMIN') {
      throw new Error(`Unauthorized ledger access. Actor [${actor.id}] lacks required scope 'ledger.transfer.execute'`);
    }

    if (payload.amount <= 0) {
      throw new Error("Transfer amount must be strictly greater than 0");
    }

    const prisma = require('../../prisma/prisma.client').default;
    const { v4: uuidv4 } = require('uuid');

    return await prisma.$transaction(async (tx: TransactionClient) => {
      // 1. Lock on Idempotency Key
      const existingKey = await tx.idempotencyKeys.findUnique({
        where: { key: payload.idempotencyKey }
      });

      if (existingKey) {
        if (existingKey.status === 'completed') return existingKey.response; // Replay stored success
        if (existingKey.status === 'processing') throw new Error('Transaction is currently processing.');
      }

      // Initialize the transaction lock processing state
      await tx.idempotencyKeys.create({
        data: { key: payload.idempotencyKey, status: 'processing' }
      });

      const txGroupId = uuidv4();

      // 2. Perform Double Entry (Failures automatically trigger prisma rollback)
      await this.recordDoubleEntry(tx, 
        {
          entryType: 'debit',
          amount: payload.amount,
          category: payload.category,
          sourceTable: payload.sourceTable,
          sourceId: payload.sourceId,
          accountId: payload.fromAccountId,
          transactionId: txGroupId
        },
        {
          entryType: 'credit',
          amount: payload.amount,
          category: payload.category,
          sourceTable: payload.sourceTable,
          sourceId: payload.sourceId,
          accountId: payload.toAccountId,
          transactionId: txGroupId
        }
      );

      const responsePayload = {
        transaction_id: txGroupId,
        amount: payload.amount,
        status: 'SUCCESS'
      };

      // 3. Persist success result to idempotency keys
      await tx.idempotencyKeys.update({
        where: { key: payload.idempotencyKey },
        data: { status: 'completed', response: responsePayload as any }
      });

      // 4. Audit Physical Money Movement explicitly
      try {
        await tx.auditLogs.create({
           data: {
              user_id: actor.id,
              actor_role: actor.role,
              action_type: 'ledger.transfer',
              target_id: txGroupId,
              metadata: {
                 amount: payload.amount,
                 category: payload.category,
                 idempotencyKey: payload.idempotencyKey
              }
           }
        });
      } catch (e: any) {
        // Safe fail: if audit logs table is missing/errors we still log it visibly
        console.warn(`[AUDIT] Missing AuditLog table/failed log: Ledger transferred by ${actor.id}`);
      }

      return responsePayload;
    });
  }
}




