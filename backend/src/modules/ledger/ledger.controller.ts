import { Request, Response } from 'express';
import { LedgerService } from './ledger.service';

const ledgerService = new LedgerService();

export class LedgerController {
  
  static async getHealth(req: Request, res: Response) {
    try {
      const healthData = await ledgerService.getSystemFinancialHealth();
      return res.status(200).json(healthData);
    } catch (error: any) {
      console.error('Failed to aggregate Financial Engine Health:', error);
      return res.status(500).json({
        type: 'about:blank',
        title: 'Financial Diagnostics Failed',
        status: 500,
        detail: error.message
      });
    }
  }
}
