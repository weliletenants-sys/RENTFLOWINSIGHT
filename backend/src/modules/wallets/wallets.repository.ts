import { TransactionClient } from '../ledger/ledger.repository';
import prisma from '../../prisma/prisma.client';

export class WalletsRepository {
  /**
   * Safe dirty read of current wallet balance for pre-validation in Business Services.
   * Does NOT lock the wallet. Real locking happens in getWalletWithLock.
   */
  async getBalance(userId: string): Promise<number> {
    const wallet = await prisma.wallets.findUnique({
      where: { account_id: userId }
    });
    return wallet ? Number(wallet.balance) : 0;
  }

  /**
   * Securely grabs an exclusive lock on the wallet row for the duration of the transaction.
   * This prevents race conditions during concurrent financial operations.
   */
  async getWalletWithLock(tx: TransactionClient, userId: string) {
    const wallets = await tx.$queryRaw<any[]>`
      SELECT * FROM "wallets" 
      WHERE "account_id" = ${userId} 
      FOR UPDATE
    `;

    return wallets.length > 0 ? wallets[0] : null;
  }

  /**
   * Initializes a new wallet if it does not exist.
   * Note: The PostgreSQL DB trigger handles this organically during ledger writes inherently.
   * This logic exists primarily for direct initializations before ledger pushes natively.
   */
  async ensureWalletExists(tx: TransactionClient, userId: string) {
    let wallet = await this.getWalletWithLock(tx, userId);
    if (!wallet) {
      const now = new Date().toISOString();
      wallet = await tx.wallets.create({
        data: {
          account_id: userId,
          balance: 0,
        }
      });
    }
    return wallet;
  }

  // NOTE: applyBalanceDelta has been entirely deprecated and removed. 
  // It is mathematically unsafe. Wallet changes only occur via `Ledger → DB Trigger → Wallet`.
}

