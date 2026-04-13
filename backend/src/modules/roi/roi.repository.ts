import prisma from '../../prisma/prisma.client';
import { LedgerService } from '../ledger/ledger.service';
import { WalletsService } from '../wallets/wallets.service';
import { v4 as uuidv4 } from 'uuid';

export class RoiRepository {
  private ledgerService = new LedgerService();
  private walletsService = new WalletsService();

  /**
   * Fetches the subset of active investor portfolios eligible for processing.
   */
  async fetchEligiblePortfolios() {
    return prisma.investorPortfolios.findMany({
      where: {
        status: 'ACTIVE'
        // further criteria, e.g., payout_day matching today, etc.
      }
    });
  }

  /**
   * Disburses ROI inside an atomic boundary for a single portfolio.
   * Isolates one failure from crashing the entire batch loop.
   */
  async processIndividualRoiPayout(portfolioId: string, partnerId: string, roiAmount: number) {
    return prisma.$transaction(async (tx) => {
      const txGroupId = uuidv4();

      // 1. Credit the Partner's Wallet First
      await this.walletsService.processLedgerEffect(tx, partnerId, roiAmount, true);

      // 2. Draft the Double Entry
      await this.ledgerService.recordDoubleEntry(tx,
        {
          amount: roiAmount,
          category: 'roi_payout',
          description: `Platform ROI payout for portfolio ${portfolioId}`,
          userId: 'system',
          sourceTable: 'investor_portfolios',
          sourceId: portfolioId,
          transactionGroupId: txGroupId,
          scope: 'platform'
        },
        {
          amount: roiAmount,
          category: 'roi_received',
          description: `ROI deposited from portfolio ${portfolioId}`,
          userId: partnerId,
          sourceTable: 'investor_portfolios',
          sourceId: portfolioId,
          transactionGroupId: txGroupId,
          scope: 'wallet'
        }
      );

      // 3. Increment the tracked portfolio yield
      await tx.investorPortfolios.update({
        where: { id: portfolioId },
        data: {
          total_roi_earned: { increment: roiAmount }
        }
      });

      return { success: true, portfolioId, txGroupId };
    });
  }
}
