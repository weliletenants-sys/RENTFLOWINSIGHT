import { Request, Response } from 'express';
import { cfoService } from './cfo.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class CfoController {
  
  public processPortfolioTopUp = async (req: Request, res: Response) => {
    try {
      const { id: portfolioId } = req.params;
      const { amount, currency, is_proxy_funding } = req.body;
      const idempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string;
      const initiatorId = req.user?.id;

      if (!initiatorId) {
        return sendError(res, 'Unauthorized', 401);
      }

      if (!portfolioId || !amount) {
        return sendError(res, 'Portfolio ID and amount are required', 400);
      }

      if (!idempotencyKey) {
        return sendError(res, 'Idempotency-Key header is required for financial transactions', 400);
      }

      const result = await cfoService.processPortfolioTopUp({
        portfolioId,
        amount: Number(amount),
        currency: currency || 'UGX',
        initiatorId,
        isProxyFunding: Boolean(is_proxy_funding),
        idempotencyKey
      });

      return sendSuccess(res, result, 'Portfolio top-up processed successfully', 200);
    } catch (error: any) {
      console.error('[CFO Controller - TopUp]', error.message);
      return sendError(res, error.message, 400);
    }
  };

  public mergePendingTopUps = async (req: Request, res: Response) => {
    try {
      const { id: portfolioId } = req.params;
      const idempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string;
      const initiatorId = req.user?.id;

      if (!initiatorId) {
        return sendError(res, 'Unauthorized', 401);
      }

      if (!portfolioId) {
        return sendError(res, 'Portfolio ID is required', 400);
      }

      if (!idempotencyKey) {
        return sendError(res, 'Idempotency-Key header is required for financial transactions', 400);
      }

      const result = await cfoService.mergePendingTopUps({
        portfolioId,
        initiatorId,
        idempotencyKey
      });

      return sendSuccess(res, result, 'Pending top-ups merged successfully', 200);
    } catch (error: any) {
      console.error('[CFO Controller - MergeTopUps]', error.message);
      return sendError(res, error.message, 400);
    }
  };
}

export const cfoController = new CfoController();
