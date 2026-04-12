import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';

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
        res.status(400).json({ error: 'Missing tenantId or amount in body.' });
        return;
      }

      const result = await this.service.processRentPayment(agentId, tenantId, Number(amount), idempotencyKey);
      
      res.status(200).json({
        message: 'Rent payment processed securely',
        data: result
      });
    } catch (error: any) {
      if (error.message.includes('Idempotency')) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes('Insufficient')) {
        res.status(402).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error processing payment.' });
      }
    }
  };
}

export const paymentsController = new PaymentsController();
