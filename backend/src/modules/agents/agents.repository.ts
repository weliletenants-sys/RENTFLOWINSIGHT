import prisma from '../../prisma/prisma.client';

export class AgentsRepository {
  /**
   * Drops an explicitly tracked Offline Form Token into the `otp_verifications` table natively.
   */
  async createTemporalTenantToken(phone: string, token: string, expiresAt: Date) {
    return prisma.otpVerifications.create({
      data: {
        phone: phone,
        otp_code: token,
        attempts: 0,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      }
    });
  }

  async getAgentVisits(agentId: string) {
    // Scaffold implementation for agents visits repository
    return [];
  }
}
