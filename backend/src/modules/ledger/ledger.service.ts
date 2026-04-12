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
      direction: 'cash_out' // Typically represents money leaving a source
    });

    const creditEntry = await this.ledgerRepository.createEntry(tx, {
      ...creditPayload,
      direction: 'cash_in' // Typically represents money entering a destination
    });

  }

  /**
   * Evaluates the absolute core physiological state of the monetary engine dynamically checking Wallet mappings against Ledger bounds.
   */
  async getSystemFinancialHealth() {
    const prisma = require('../../prisma/prisma.client').default;

    const ledgerIns = await prisma.generalLedger.aggregate({
      _sum: { amount: true },
      where: { direction: 'cash_in' }
    });
    const ledgerOuts = await prisma.generalLedger.aggregate({
      _sum: { amount: true },
      where: { direction: 'cash_out' }
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

    // Orphaned records check (Transactions missing ledger links or ghost transactions)
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
}

