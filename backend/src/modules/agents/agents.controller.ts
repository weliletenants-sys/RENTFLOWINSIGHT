import { Request, Response } from 'express';
import { AgentsService } from './agents.service';

export class AgentsController {
  private service = new AgentsService();

  /**
   * Endpoint: POST /agents/tenants/tokens/generate
   */
  public generateTenantFormToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const agentId = (req as any).user?.id;
      const { tenant_phone } = req.body;

      if (!tenant_phone) {
        res.status(400).json({ error: 'Tenant phone string required' });
        return;
      }

      const result = await this.service.triggerTenantOfflineToken(agentId, tenant_phone);
      
      res.status(201).json({
        message: 'Tenant form token safely generated',
        data: result
      });
    } catch (error: any) {
      if (error.message.includes('required')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error spinning temporal token.' });
      }
    }
  };
}

export const agentsController = new AgentsController();
