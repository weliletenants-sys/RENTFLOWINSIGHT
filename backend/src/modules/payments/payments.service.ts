import { PaymentsRepository } from './payments.repository';
import { WalletsRepository } from '../wallets/wallets.repository';
import { EventDispatcher } from '../../events/EventDispatcher';
import { v4 as uuidv4 } from 'uuid';

export class PaymentsService {
  private repository = new PaymentsRepository();
  private walletsRepo = new WalletsRepository();

  /**
   * Orchestrates the rent payment execution securely, isolating business logic
   * strictly inside the service layer.
   */
  async processRentPayment(agentId: string, tenantId: string, amount: number, referenceKey?: string) {
    // 1. Validate Business Rules
    if (!agentId || !tenantId) {
      throw new Error('Agent and Tenant identifiers are strictly required.');
    }

    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    // 2. Pre-flight Balance Validation (Business Logic)
    const walletBalance = await this.walletsRepo.getBalance(agentId);
    if (walletBalance < amount) {
      throw new Error('Insufficient Funds: Agent wallet cannot drop below 0.');
    }

    // Provision an idempotency key safely
    const idempotencyReference = referenceKey || uuidv4();

    // 3. Execute Transaction via strict Repository
    try {
      const result = await this.repository.executeRentPaymentTransaction({
        agentId,
        tenantId,
        amount,
        reference: idempotencyReference
      });

      // 4. Fire Async Event ensuring decoupled listeners can process side-effects independently 
      EventDispatcher.emit('payment.created', {
          transactionGroupId: result.transactionGroupId,
          agentId,
          tenantId,
          amount
      });

      return result;
    } catch (error: any) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }
}
