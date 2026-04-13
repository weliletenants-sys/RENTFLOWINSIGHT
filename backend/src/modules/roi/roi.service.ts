import { RoiRepository } from './roi.repository';

export class RoiService {
  private repository = new RoiRepository();

  /**
   * Represents the batch process logic to calculate and issue 15% ROI 
   * returns across active portfolios.
   */
  async runRoiCycle() {
    const portfolios = await this.repository.fetchEligiblePortfolios();
    const results = {
      processed: 0,
      failed: 0,
      totalYield: 0,
      errors: [] as { id: string, message: string }[]
    };

    if (portfolios.length === 0) {
      return results;
    }

    for (const portfolio of portfolios) {
      try {
        // Calculate 15% of the principal amount for the cycle.
        const roiAmount = (portfolio.investment_amount * 15) / 100;
        const partnerId = portfolio.investor_id;

        // Skip invalid portfolios
        if (!partnerId || roiAmount <= 0) continue;

        await this.repository.processIndividualRoiPayout(portfolio.id, partnerId, roiAmount);

        results.processed++;
        results.totalYield += roiAmount;
      } catch (error: any) {
        results.failed++;
        results.errors.push({ id: portfolio.id, message: error.message });
      }
    }

    return results;
  }
}
