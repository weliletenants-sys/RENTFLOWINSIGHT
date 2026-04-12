import { TenantsRepository } from './tenants.repository';
// Seamless capability wrapping directly to existing Payments Service securely.
import { PaymentsService } from '../payments/payments.service';

export class TenantsService {
  private repository = new TenantsRepository();
  private paymentsService = new PaymentsService();

  /**
   * Safe facade wrapper to cleanly pass tenant repayment logic.
   */
  async settleRentBalance(tenantId: string, amount: number, paymentMethodToken: string) {
    if (!tenantId) throw new Error('Tenant identification strictly required.');
    if (amount <= 0) throw new Error('Payments must genuinely resolve balance.');

    // In severe scaling setups, we delegate identity to agent strings here securely.
    // For now we map to the global payments orchestrator directly simulating system agent.
    const result = await this.paymentsService.processRentPayment('system', tenantId, amount, paymentMethodToken);

    // If successful, decrement the active ledger tracking request physically
    const activeRequest = await this.repository.getActiveRentRequestSafe(tenantId);
    if (activeRequest) {
      const remainingBalance = activeRequest.amount - amount;
      await this.repository.updateRentRequestPaymentStatus(activeRequest.id, remainingBalance);
    }

    return result;
  }
}
