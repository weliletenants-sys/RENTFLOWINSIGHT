import { AgentsRepository } from './agents.repository';

export class AgentsService {
  private repository = new AgentsRepository();

  /**
   * Generates a 6-digit temporal offline key to assist tenant onboarding natively.
   */
  async triggerTenantOfflineToken(agentId: string, tenantPhone: string) {
    if (!agentId) throw new Error('Agent identity required to issue form tokens.');
    if (!tenantPhone) throw new Error('Tenant phone required to peg the offline token.');

    // Math.floor logic extracted natively cleanly
    const tokenCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24H lifespan

    await this.repository.createTemporalTenantToken(tenantPhone, tokenCode, expiresAt);

    return {
      tokenCode,
      expiresAt: expiresAt.toISOString()
    };
  }
}
