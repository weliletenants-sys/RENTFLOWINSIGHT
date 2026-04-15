import { Router, Request, Response } from 'express';
import tenantOpsRoutes from './tenantops.routes';
import agentOpsRoutes from './agentops.routes';
import landlordOpsRoutes from './landlordops.routes';
import partnerOpsRoutes from './partnerops.routes';
import riskOpsRoutes from '../modules/risk/risk.routes';
import prisma from '../../prisma/prisma.client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

// Financial Ops is intentionally excluded here as it mounts to /admin/finops directly.
// These ops routes will be secured individually by their respective route controllers in Phase 3.5.
router.use('/tenant', tenantOpsRoutes);
router.use('/agent', agentOpsRoutes);
router.use('/landlord', landlordOpsRoutes);
router.use('/partner', partnerOpsRoutes);
router.use('/risk', riskOpsRoutes);

// ==========================================
// SYSTEM DLQ (Dead Letter Queue) OPS
// ==========================================
router.get('/system/dlq', 
    authenticate, 
    authorize({ roles: ['ADMIN', 'DEVELOPER'], scopes: ['dlq.read'] }), 
    async (req: Request, res: Response) => {
        try {
            const failedEvents = await prisma.outboxEvents.findMany({
                where: { status: 'failed' },
                orderBy: { created_at: 'desc' },
                take: 100
            });
            return res.json({ data: failedEvents });
        } catch (e: any) {
            return res.status(500).json({ error: e.message });
        }
    }
);

router.post('/system/dlq/:id/retry', 
    authenticate, 
    authorize({ roles: ['ADMIN', 'DEVELOPER'], scopes: ['dlq.retry'] }), 
    async (req: Request, res: Response) => {
        try {
            const eventId = req.params.id;
            
            // Reset the event back to pending safely so the Outbox worker can re-claim it natively
            const updated = await prisma.outboxEvents.update({
                where: { id: eventId, status: 'failed' },
                data: { 
                    status: 'pending',
                    locked_at: null 
                }
            });

            // Audit the critical recovery action structurally
            try {
                await prisma.auditLogs.create({
                    data: {
                        user_id: req.user?.id || 'anonymous',
                        actor_role: req.user?.role || 'UNKNOWN',
                        action_type: 'dlq.retry',
                        target_id: eventId,
                        metadata: { details: 'DLQ manual retry triggered gracefully' }
                    }
                });
            } catch (auditErr) {
                console.warn(`[AUDIT] Failed to write AuditLog for DLQ Retry on event ${eventId}`);
            }

            return res.json({ message: 'Event pushed back to Outbox Queue successfully', event: updated });
        } catch (e: any) {
            return res.status(500).json({ error: 'Failed to push DLQ event back into the pipeline' });
        }
    }
);

export default router;

