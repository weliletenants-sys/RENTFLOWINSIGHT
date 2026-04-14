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

  static async transfer(req: Request, res: Response) {
    try {
      const idempotencyKey = req.headers['x-idempotency-key'] || req.headers['idempotency-key'];
      const { fromAccountId, toAccountId, amount, category, description, sourceTable, sourceId } = req.body;

      if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        return res.status(400).json({
          title: 'Missing Idempotency Key',
          detail: 'The X-Idempotency-Key header is strictly required for ledger transfers to prevent duplicate transactions.'
        });
      }

      if (!fromAccountId || !toAccountId || !amount || !category) {
        return res.status(400).json({ error: 'Missing required transfer fields: fromAccountId, toAccountId, amount, category.' });
      }

      // Safe Extraction of Actor injected by the pure authorize middleware
      const actor = {
        id: req.user?.id || 'anonymous',
        role: req.user?.role || 'UNKNOWN',
        scopes: req.user?.scopes || []
      };

      const result = await ledgerService.transferWithIdempotency(
        {
          idempotencyKey,
          fromAccountId,
          toAccountId,
          amount: Number(amount),
          category,
          description,
          sourceTable,
          sourceId
        },
        actor
      );

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes('Processing') || error.message.includes('processing')) {
        return res.status(409).json({ error: 'Transaction is currently processing. Please wait.' });
      }
      console.error('Ledger Transfer Failed:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

