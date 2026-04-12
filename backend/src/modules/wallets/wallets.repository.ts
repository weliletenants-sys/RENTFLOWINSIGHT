import { TransactionClient } from '../ledger/ledger.repository';
import prisma from '../../prisma/prisma.client';

export class WalletsRepository {
  /**
   * Securely grabs an exclusive lock on the wallet row for the duration of the transaction.
   * This prevents race conditions during concurrent financial operations.
   */
  async getWalletWithLock(tx: TransactionClient, userId: string) {
    const wallets = await tx.$queryRaw<any[]>`
      SELECT * FROM "wallets" 
      WHERE "user_id" = ${userId} 
      FOR UPDATE
    `;

    return wallets.length > 0 ? wallets[0] : null;
  }

  /**
   * Initializes a new wallet if it does not exist.
   */
  async ensureWalletExists(tx: TransactionClient, userId: string) {
    let wallet = await this.getWalletWithLock(tx, userId);
    if (!wallet) {
      const now = new Date().toISOString();
      wallet = await tx.wallets.create({
        data: {
          user_id: userId,
          balance: 0,
          created_at: now,
          updated_at: now
        }
      });
    }
    return wallet;
  }

  /**
   * Updates balance securely within a transaction
   */
  async applyBalanceDelta(
    tx: TransactionClient, 
    userId: string, 
    amountDelta: number,
    ledgerEventId: string,
    ledgerEntryId: string | null,
    triggeredByType: string,
    triggeredById: string
  ) {
    const wallet = await this.ensureWalletExists(tx, userId);
    const beforeBalance = Number(wallet.balance) || 0;
    const delta = Number(amountDelta);
    const expectedAfter = beforeBalance + delta;
    
    const now = new Date().toISOString();
    
    // We strictly use atomic increments/decrements mapped onto active reads natively
    const updatedWallet = await tx.wallets.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: delta },
        updated_at: now
      }
    });

    const actualAfter = Number(updatedWallet.balance);

    // Courtroom-grade invariant asserting mechanical logic truthfully matches native DB calculation
    if (Math.abs(actualAfter - expectedAfter) > 0.0001) { // Allowing micro-float leniency or using strictly BigInt/Decimal mapping bounds
       throw new Error(`[FATAL INCONSISTENCY] Wallet Balance corruption detected for user ${userId}. Expected ${expectedAfter}, but DB resulted in ${actualAfter}. Transaction violently aborted.`);
    }

    // Capture the Forensic Trace immediately prior to committing the block naturally
    await tx.auditTrail.create({
      data: {
        wallet_id: wallet.id,
        ledger_event_id: ledgerEventId,
        ledger_entry_id: ledgerEntryId,
        triggered_by_type: triggeredByType,
        triggered_by_id: triggeredById,
        before_balance: beforeBalance,
        after_balance: actualAfter,
        delta: delta
      }
    });

    return updatedWallet;
  }
}
