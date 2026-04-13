import { Request, Response } from 'express';
import { RepaymentsService } from './repayments.service';
import { sendResponse, sendError } from '../../shared/utils/response.util';

export class RepaymentsController {
    private repaymentsService = new RepaymentsService();

    /**
     * POST /api/v2/repayments/tenant
     * Strict Tenant-driven debt clearing flow natively.
     */
    async repayByTenant(req: Request, res: Response) {
        try {
            const { amount, idempotencyKey, rentRequestId } = req.body;
            // Native mapping implies user extraction organically derived via Auth interceptor payload
            const tenantId = req.user?.id; 

            if (!tenantId) throw new Error('Unauthorized Boundary Exception: Tenant ID critically missing.');
            if (!amount || amount <= 0) throw new Error('Repayment mapping failed: Amounts must dynamically shift bounded values above 0.');
            if (!idempotencyKey) throw new Error('Idempotency Key strictly mandated against duplicate captures.');

            const result = await this.repaymentsService.repayByTenant({
                tenantId,
                amount: Number(amount),
                idempotencyKey,
                rentRequestId
            });

            return sendResponse(res, req.id, result, 'Tenant Repayment successfully committed sequentially.');
        } catch (error: any) {
            return sendError(res, req.id, 400, error.message);
        }
    }

    /**
     * POST /api/v2/repayments/agent
     * Explicit Agent proxy resolution settling the graph remotely cleanly bound back mapped.
     */
    async repayByAgent(req: Request, res: Response) {
        try {
            const { tenantId, amount, idempotencyKey, rentRequestId } = req.body;
            const agentId = req.user?.id;

            if (!agentId) throw new Error('Unauthorized Boundary Exception: Agent identity strictly required.');
            if (!tenantId) throw new Error('Tenant alignment required logically.');
            if (!idempotencyKey) throw new Error('Idempotency Key must uniquely stamp this specific action natively.');
            if (!amount || amount <= 0) throw new Error('Repayment metrics critically require positive bounds strictly.');

            const result = await this.repaymentsService.repayByAgent({
                agentId,
                tenantId,
                amount: Number(amount),
                idempotencyKey,
                rentRequestId
            });

            return sendResponse(res, req.id, result, 'Agent Repayment strictly orchestrated successfully.');
        } catch (error: any) {
            return sendError(res, req.id, 400, error.message);
        }
    }
}
