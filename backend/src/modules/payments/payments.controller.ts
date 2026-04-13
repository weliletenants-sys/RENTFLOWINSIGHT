import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export class PaymentsController {
  private service = new PaymentsService();

  /**
   * Endpoint: POST /payments/rent
   */
  public payRent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId, amount, idempotencyKey } = req.body;
      const agentId = (req as any).user?.id || 'TEST_AGENT_ID';

      if (!tenantId || !amount) {
        return sendError(res, 'Missing tenantId or amount in body.', 400);
      }

      const result = await this.service.processRentPayment(agentId, tenantId, Number(amount), idempotencyKey);
      
      return sendSuccess(res, result, 'Rent payment processed securely');
    } catch (error: any) {
      if (error.message.includes('Idempotency')) {
        return sendError(res, error.message, 409);
      } else if (error.message.includes('Insufficient')) {
        return sendError(res, error.message, 402);
      } else {
        return sendError(res, 'Internal Server Error processing payment.', 500);
      }
    }
  };
}

export const paymentsController = new PaymentsController();
