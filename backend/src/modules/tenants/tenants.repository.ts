import prisma from '../../prisma/prisma.client';

export class TenantsRepository {
  /**
   * Reads basic structural data regarding active rent requests.
   */
  async getActiveRentRequestSafe(tenantId: string) {
    return prisma.rentRequests.findFirst({
      where: {
        tenant_id: tenantId,
        status: { in: ['APPROVED', 'PENDING', 'ACTIVE'] }
      }
    });
  }

  /**
   * Tracks the physical status modification resulting directly from payment clearances.
   */
  async updateRentRequestPaymentStatus(requestId: string, newBalance: number) {
    const updatedStatus = newBalance <= 0 ? 'COMPLETED' : 'ACTIVE';
    
    return prisma.rentRequests.update({
      where: { id: requestId },
      data: {
        amount: newBalance,
        status: updatedStatus,
        updated_at: new Date().toISOString()
      }
    });
  }
}
