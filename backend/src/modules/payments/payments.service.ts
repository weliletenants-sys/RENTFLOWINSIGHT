import { PaymentsRepository } from './payments.repository';
import { v4 as uuidv4 } from 'uuid';

export class PaymentsService {
  private repository = new PaymentsRepository();

  /**
   * Orchestrates the rent payment execution securely, isolating controller HTTP logic
   * from the database execution flow.
   */
  async processRentPayment(agentId: string, tenantId: string, amount: number, referenceKey?: string) {
    if (!agentId || !tenantId) {
      throw new Error('Agent and Tenant identifiers are strictly required.');
    }

    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    // Provision an idempotency key if one wasn't provided, though client-provided is safer.
    const idempotencyReference = referenceKey || uuidv4();

    try {
      const result = await this.repository.executeRentPaymentTransaction({
        agentId,
        tenantId,
        amount,
        reference: idempotencyReference
      });
      return result;
    } catch (error: any) {
      // Logic could catch Insufficient Funds vs Idempotency Violations here to re-throw cleanly
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }
}
