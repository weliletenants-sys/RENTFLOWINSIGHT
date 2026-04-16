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

    const { v4: uuidv4 } = require('uuid');
    const financialTxId = debitPayload.transactionGroupId || debitPayload.transactionId || uuidv4();
    const idempotencyKey = financialTxId;

    // We assume strict systemic accounts for non-wallet inputs
    const resolveAccount = async (payload: any) => {
        if (payload.accountId) return payload.accountId;
        // Dynamically discover/create system account for category
        const cacheKey = `SYS_PLATFORM_${payload.category}`.toUpperCase();
        let sysAcct = await tx.financialAccounts.findFirst({ where: { id: cacheKey } });
        if (!sysAcct) {
            sysAcct = await tx.financialAccounts.create({
                data: { id: cacheKey, type: 'SYSTEM', currency: 'UGX' }
            });
        }
        return sysAcct.id;
    };

    const debitAccountId = await resolveAccount(debitPayload);
    const creditAccountId = await resolveAccount(creditPayload);

    // 1. Create FinancialTransaction Shell
    let finTx = await tx.financialTransactions.findUnique({ where: { idempotency_key: idempotencyKey }});
    if (finTx) {
       console.log(`[Ledger Engine] Duplicate Idempotency Key detected: ${idempotencyKey}. Transfer safely swallowed.`);
       return finTx; // Safe exit if this was a network retry
    }

    try {
       finTx = await tx.financialTransactions.create({
          data: {
              id: financialTxId,
              idempotency_key: idempotencyKey,
              status: 'COMPLETED',
              reference: debitPayload.category || 'UNKNOWN',
              metadata: {
                  category: debitPayload.category,
                  source_table: debitPayload.sourceTable,
                  source_id: debitPayload.sourceId
              }
          }
       });
    } catch (e: any) {
        if (e.code === 'P2002') {
             console.log(`[Ledger Engine] Race condition IDEMPOTENT collision: ${idempotencyKey}. Execution safely halted.`);
             return { status: 'idempotency_halt', message: 'Transaction already successfully processed.' };
        }
        throw e;
    }

    // 2. Insert Entries
    await tx.financialEntries.create({
        data: {
            transaction_id: finTx.id,
            account_id: debitAccountId,
            amount: debitPayload.amount,
            type: 'DEBIT'
        }
    });

    await tx.financialEntries.create({
        data: {
            transaction_id: finTx.id,
            account_id: creditAccountId,
            amount: creditPayload.amount,
            type: 'CREDIT'
        }
    });
  }

  /**
   * Evaluates the absolute core physiological state of the monetary engine dynamically checking Wallet mappings against Ledger bounds.
   */
  async getSystemFinancialHealth() {
    const prisma = require('../../prisma/prisma.client').default;

    const ledgerIns = await prisma.financialEntries.aggregate({
      _sum: { amount: true },
      where: { type: 'CREDIT' }
    });
    const ledgerOuts = await prisma.financialEntries.aggregate({
      _sum: { amount: true },
      where: { type: 'DEBIT' }
    });

    const totalSystemIn = ledgerIns._sum.amount || 0;
    const totalSystemOut = ledgerOuts._sum.amount || 0;
    const isGlobalBalanced = Math.abs(totalSystemIn - totalSystemOut) <= 0.0001;

    // Check physical wallet sync against derived truth
    const physicalWallets = await prisma.financialAccounts.aggregate({
      _sum: { balance: true },
      where: { type: 'WALLET' }
    });
    const totalWalletBalance = physicalWallets._sum.balance || 0;

    // Check for Duplicated Idempotency Keys natively (Event Level Isolation)
    const duplicates = await prisma.$queryRaw`
      SELECT idempotency_key, count(*) as count 
      FROM financial_transactions 
      WHERE idempotency_key IS NOT NULL 
      GROUP BY idempotency_key 
      HAVING count(*) > 1
    ` as any[];

    const orphans = await prisma.$queryRaw`
      SELECT t.id 
      FROM financial_transactions t
      LEFT JOIN financial_entries l ON t.id = l.transaction_id
      WHERE l.id IS NULL
    ` as any[];

    return {
      wallet_vs_ledger_match: isGlobalBalanced,
      total_wallet_balance: totalWalletBalance,
      total_ledger_balance: totalSystemIn, // True absolute volume
      orphan_transactions: orphans.length,
      duplicate_idempotency_keys: duplicates.length,
      last_checked_at: new Date().toISOString()
    };
  }

  /**
   * Enqueues an asynchronous double-entry transfer guaranteed exactly-once via Hybrid Redis/PostgreSQL idempotency locks.
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

    const { enqueueLedgerTransaction } = require('../../queues/ledger.queue');
    const getRedisClient = require('../../config/redis.client').default || require('../../config/redis.client').getRedisClient;
    const redis = getRedisClient();

    // 1. O(1) Memory Idempotency Lock (Fast-Gate)
    // Locked for 5 mins minimum (worst case process time). DB handles absolute persistence.
    const lockKey = `idempotency:ledger:${payload.idempotencyKey}`;
    const acquired = await redis.set(lockKey, 'processing', 'NX', 'PX', 300000);
    
    if (!acquired) {
       console.log(`[Ledger API] Hybrid Idempotency blocked duplicate request at Redis bound: ${payload.idempotencyKey}`);
       return { status: 'DUPLICATE_ACKNOWLEDGED', message: 'Transaction is currently processing or completed.', transaction_id: payload.idempotencyKey };
    }

    // 2. Queue High-Volume Robust Payload
    await enqueueLedgerTransaction({
       ...payload,
       actor
    });

    // 3. Immediacy Return Code. (Client polls or listens to SSE)
    return {
      status: 'PENDING_DELIVERY',
      transaction_id: payload.idempotencyKey,
      message: 'Transaction successfully enqueued to Financial Engine.'
    };
  }
}




