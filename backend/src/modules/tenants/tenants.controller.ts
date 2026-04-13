import { Request, Response } from 'express';
import { TenantsService } from './tenants.service';

export class TenantsController {
  private service = new TenantsService();

  /**
   * Endpoint: POST /tenants/rent/pay
   */
  public payRent = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req as any).user?.id || 'TEST_TENANT_ID';
      const { amount, paymentMethodToken } = req.body;

      if (!amount) {
        res.status(400).json({ error: 'Valid transaction amount strictly required.' });
        return;
      }

      const result = await this.service.settleRentBalance(tenantId, Number(amount), paymentMethodToken);
      
      res.status(200).json({
        message: 'Rent payment successfully processed entirely inside modular framework.',
        data: result
      });
    } catch (error: any) {
      if (error.message.includes('required')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error bouncing rent payment.' });
      }
    }
  };
}

export const tenantsController = new TenantsController();
