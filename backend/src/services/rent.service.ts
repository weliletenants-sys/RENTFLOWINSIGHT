import prisma from '../prisma/prisma.client';

export class RentService {
  /**
   * Calculates dynamic fees based on duration and amount.
   * Compounded monthly (30 days).
   */
  static calculateFees(amount: number, durationDays: number, rateMultiplier: number = 1.33) {
    const accessFee = amount * (Math.pow(rateMultiplier, durationDays / 30) - 1);
    const requestFee = amount > 200000 ? 20000 : 10000;
    const totalRepayment = amount + accessFee + requestFee;
    const dailyRepayment = Math.ceil(totalRepayment / durationDays);

    return { accessFee, requestFee, totalRepayment, dailyRepayment };
  }

  /**
   * Core logic for submitting a new rent request
   */
  static async createRentRequest(tenantId: string, propertyId: string, amount: number, months: number) {
    const durationDays = months * 30;
    const { accessFee, requestFee, totalRepayment, dailyRepayment } = this.calculateFees(amount, durationDays);

    const request = await prisma.rentRequests.create({
      data: {
        tenant_id: tenantId,
        landlord_id: propertyId,
        rent_amount: amount,
        duration_days: durationDays,
        access_fee: accessFee,
        request_fee: requestFee,
        total_repayment: totalRepayment,
        status: 'PENDING',
        daily_repayment: dailyRepayment,
        amount_repaid: 0,
        tenant_no_smartphone: false,
        lc1_id: 'default-lc1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return request;
  }

  /**
   * Fetch rent requests by a specific tenant
   */
  static async getRequestsByTenant(tenantId: string) {
    return prisma.rentRequests.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Fetch all rent requests globally
   */
  static async getAllRequests() {
    return prisma.rentRequests.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Update the status of a rent request
   */
  static async updateStatus(requestId: string, status: string) {
    return prisma.rentRequests.update({
      where: { id: requestId },
      data: { 
        status,
        updated_at: new Date().toISOString()
      },
    });
  }

  // --- AGENT SPECIFIC ---

  static async getAgentRentRequests(agentId: string) {
    return prisma.agentRentRequests.findMany({
      where: { agent_id: agentId },
      orderBy: { created_at: 'desc' }
    });
  }

  static async createAgentRentRequest(agentId: string, tenantId: string | undefined, tenantName: string | undefined, phone: string | undefined, amount: number) {
    // Check for explicit duplicates (same tenant, same amount, still pending)
    const existing = await prisma.agentRentRequests.findFirst({
        where: {
          agent_id: agentId,
          amount: amount,
          status: 'Pending',
          ...(tenantId ? { tenant_id: tenantId } : { tenant_name: tenantName })
        }
    });

    if (existing) {
        throw { status: 400, name: 'Duplicate Request', message: 'A pending request for this tenant and amount already exists.' };
    }

    const now = new Date().toISOString();

    return prisma.agentRentRequests.create({
      data: {
        agent_id: agentId,
        tenant_id: tenantId || null,
        tenant_name: tenantName || null,
        phone: phone || null,
        amount: amount,
        status: 'Pending',
        created_at: now,
        updated_at: now
      }
    });
  }

  static async processAgentRentRequest(agentId: string, requestId: string) {
    const request = await prisma.agentRentRequests.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw { status: 404, name: 'Not Found', message: 'Rent request not found' };
    }
    if (request.agent_id !== agentId) {
      throw { status: 403, name: 'Forbidden', message: 'You do not have permission to access this request' };
    }
    if (request.status !== 'Approved') {
      throw { status: 400, name: 'Invalid State', message: 'Only approved requests can be explicitly processed.' };
    }

    const now = new Date().toISOString();

    return prisma.agentRentRequests.update({
      where: { id: requestId },
      data: {
        status: 'Processed',
        processed_at: now,
        updated_at: now
      }
    });
  }
}
