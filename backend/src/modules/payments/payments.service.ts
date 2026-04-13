import { PaymentsRepository, ExecutePaymentConfig } from './payments.repository';
import { WalletsRepository } from '../wallets/wallets.repository';
import { v4 as uuidv4 } from 'uuid';

export class PaymentsService {
  private repository = new PaymentsRepository();
  private walletsRepo = new WalletsRepository();

  /**
   * The Central Financial Gateway.
   * Universal executor for all inbound platform capabilities ensuring balances validate natively
   * before safely passing control into the isolated Ledger atom queue.
   */
  async execute(config: ExecutePaymentConfig) {
    if (!config.debitAccountId || !config.creditAccountId) {
      throw new Error('Transaction requires explicit bounds for both target and destination nodes.');
    }
    if (config.amount <= 0) {
      throw new Error('Amount must be positively aligned mathematically.');
    }

    // 1. Balance Enforcements 
    // Notice: Debit targets specifically must be inherently fluid (Wallet checks required)
    // Wallets are inherently protected natively inside PostgreSQL as well, this simply optimizes feedback.
    const walletBalance = await this.walletsRepo.getBalance(config.debitAccountId);
    if (walletBalance < config.amount) {
      throw new Error(`Insufficient Funds: Source bounds [${config.debitAccountId}] critically underfunded.`);
    }

    try {
      // 2. Delegate to the Atom lock organically
      const result = await this.repository.executeFinancialTransaction(config);
      return result;
    } catch (error: any) {
      throw new Error(`Payment processing physically failed: ${error.message}`);
    }
  }
}
