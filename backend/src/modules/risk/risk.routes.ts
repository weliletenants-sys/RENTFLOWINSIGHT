import { Router, Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { LedgerService } from '../ledger/ledger.service';

const router = Router();

// ==========================================
// PENDING INVESTIGATIONS LISTING
// ==========================================
router.get('/reviews',
    authenticate,
    authorize({ roles: ['ADMIN', 'FINOPS'], scopes: ['risk.review.execute'] }),
    async (req: Request, res: Response) => {
        try {
            const pending = await prisma.riskReview.findMany({
                where: { status: 'PENDING' },
                orderBy: { createdAt: 'desc' }
            });
            return res.json({ data: pending });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

// ==========================================
// ATOMIC OVERRIDE ACTIONS
// ==========================================
router.post('/review/:id/approve',
    authenticate,
    authorize({ roles: ['ADMIN', 'FINOPS'], scopes: ['risk.review.execute'] }),
    async (req: Request, res: Response) => {
        try {
            const reviewId = req.params.id;
            const actorId = req.user?.id!;

            // We must execute sequentially in a transaction to block double-payouts permanently
            await prisma.$transaction(async (tx) => {
                // Optimistic locking using where constraints is inherently atomic in Postgres
                const review = await tx.riskReview.findUnique({ where: { id: reviewId } });
                
                if (!review) throw new Error("Review record not found");
                if (review.status !== 'PENDING') throw new Error(`Already Handled: Risk rule is permanently ${review.status}`);

                // Mark the state globally isolated for the Recovery Worker to pick up
                await tx.riskReview.update({
                    where: { id: reviewId, status: 'PENDING' }, // Enforce transition lock
                    data: {
                        status: 'APPROVED_PENDING_EXECUTION',
                        decidedBy: actorId,
                        decidedAt: new Date()
                    }
                });

                // Write native explicitly audit tracked logs for Manual overrides
                await tx.auditLogs.create({
                    data: {
                        user_id: actorId,
                        actor_role: req.user?.role || 'UNKNOWN',
                        action_type: 'risk.review.approve_pending_execution',
                        target_id: reviewId,
                        metadata: { eventId: review.event_id, amount: review.amount }
                    }
                });

                // NO Ledger Execution Here. 
                // The Risk Worker handles ledger transfers asynchronously to secure reconciliation mapping.
            });

            return res.json({ message: 'Risk review marked for execution. The background worker will process the financial transfer safely.' });
        } catch (error: any) {
            console.error(`[RISK OVERRIDE] Failed to execute Approval path for ${req.params.id}`, error);
            // Translate generic errors safely back matching conflict logic
            if (error.message.includes('Already Handled')) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Manual Risk Approval Engine Failed to Process.' });
        }
    }
);

router.post('/review/:id/reject',
    authenticate,
    authorize({ roles: ['ADMIN', 'FINOPS'], scopes: ['risk.review.execute'] }),
    async (req: Request, res: Response) => {
        try {
            const reviewId = req.params.id;
            const actorId = req.user?.id!;

            await prisma.$transaction(async (tx) => {
                const review = await tx.riskReview.findUnique({ where: { id: reviewId } });
                
                if (!review) throw new Error("Review record not found");
                if (review.status !== 'PENDING') throw new Error(`Already Handled: Risk rule is permanently ${review.status}`);

                await tx.riskReview.update({
                    where: { id: reviewId },
                    data: {
                        status: 'REJECTED',
                        decidedBy: actorId,
                        decidedAt: new Date()
                    }
                });

                await tx.auditLogs.create({
                    data: {
                        user_id: actorId,
                        actor_role: req.user?.role || 'UNKNOWN',
                        action_type: 'risk.review.reject',
                        target_id: reviewId,
                        metadata: { eventId: review.event_id }
                    }
                });
            });

            return res.json({ message: 'Risk systematically isolated and blocked permanently.' });
        } catch (error: any) {
             if (error.message.includes('Already Handled')) {
                 return res.status(409).json({ error: error.message });
             }
             return res.status(500).json({ error: 'Manual Risk Reject Engine Failed.' });
        }
    }
);

export default router;
