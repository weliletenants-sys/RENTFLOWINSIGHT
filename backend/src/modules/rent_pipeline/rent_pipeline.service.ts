import prisma from '../../prisma/prisma.client';
import { RentPipelineStatus, STATE_TRANSITIONS } from './rent_pipeline.types';

export class RentPipelineService {
  /**
   * Safely transitions the state strictly checking forward momentum. 
   * NEVER allows unmapped jumps to preserve the fundamental business timeline.
   */
  async transitionTo(requestId: string, newStatus: RentPipelineStatus) {
    const request = await prisma.rentRequests.findUnique({ where: { id: requestId }});
    if (!request) throw new Error('Rent request missing in pipeline resolution.');

    const currentStatus = (request.status || 'REQUESTED') as RentPipelineStatus;

    if (!STATE_TRANSITIONS[currentStatus].includes(newStatus)) {
      throw new Error(`Invalid state transition natively isolated. Cannot move from ${currentStatus} to ${newStatus}.`);
    }

    return prisma.rentRequests.update({
      where: { id: requestId },
      data: { status: newStatus }
    });
  }

  /**
   * Identically structured transaction mapping the underlying Remaining Balance to the 
   * Event emissions natively ensuring Overpayments violently trap mathematically.
   */
  async applyDebtReduction(requestId: string, amount: number, repaymentId: string) {
    return prisma.$transaction(async (tx) => {
      // Idempotency: Definitively ensure we haven't mapped this repayment string yet mathematically.
      const existingKey = await tx.pipelineIdempotency.findUnique({
        where: { repayment_id: repaymentId }
      });
      if (existingKey) {
         console.log(`[PIPELINE] Safely ignoring duplicate Repayment Event ${repaymentId}`);
         return null;
      }

      await tx.pipelineIdempotency.create({
         data: { repayment_id: repaymentId, rent_request_id: requestId }
      });

      const request = await tx.rentRequests.findUnique({ where: { id: requestId } });
      if (!request) throw new Error(`Rent request ${requestId} explicitly omitted during lock.`);

      if (request.remaining_balance <= 0) {
        return { newStatus: request.status }; // already settled previously organically
      }

      const newBalance = request.remaining_balance - amount;

      // STRICT MODE: Overpayment handling
      if (newBalance < 0) {
        throw new Error('Overpayment natively rejected. Partial balance overlaps strictly blocked mathematically.');
      }

      const newStatus = newBalance === 0 ? 'REPAID' : request.status;

      await tx.rentRequests.update({
        where: { id: requestId },
        data: {
          remaining_balance: newBalance,
          status: newStatus,
        },
      });

      // Special allowance for pure auto-transitions conceptually into abstract closure
      if (newStatus === 'REPAID') {
          // You could optionally transition REPAID -> CLOSED instantly here, but we will leave it 
          // to output events so subsequent layers safely grab the 'REPAID' metadata independently structure.
      }

      return { newBalance, newStatus, tenantId: request.tenant_id };
    });
  }
}
