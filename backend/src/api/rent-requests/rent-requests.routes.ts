import { Router, Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { ensureUserAuthenticated, rolesGuard } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validation.middleware';
import { createRentRequestSchema } from './rent-requests.schemas';

const router = Router();

/**
 * PHASE 2 ASYNC ENDPOINT: Instead of processing a rent request inline, 
 * this endpoint drops the request into an Outbox table and immediately returns 202 Accepted.
 */
router.post('/', ensureUserAuthenticated, rolesGuard(['TENANT']), validateSchema(createRentRequestSchema), async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const tenantId = (req as any).user.sub;

        // Start bounded transaction to guarantee 100% DB delivery
        await prisma.$transaction(async (tx) => {
            // Write event to Postgres Outbox to ensure Bulletproof persistence before passing to BullMQ Worker
            await tx.outboxEvents.create({
                data: {
                    type: 'rent.requested',
                    payload: { ...payload, tenantId },
                    status: 'pending'
                }
            });
            // We do NOT process it here. The Rent Processor Worker bridges it from postgres to the BullMQ.
        });

        // Immediately respond 202 indicating the message is safely held and will be queued asynchronously.
        return res.status(202).json({
            status: 'queued',
            message: 'Rent request successfully registered for processing.',
        });
    } catch (e: any) {
        console.error('Failed to enqueue rent request:', e);
        return res.status(500).json({ error: 'System error queueing rent request' });
    }
});

// Implement generic polling endpoint (Step 2.6)
router.get('/status/:id', ensureUserAuthenticated, async (req: Request, res: Response) => {
    try {
        const outboxEvent = await prisma.outboxEvents.findUnique({ where: { id: req.params.id }});
        if (!outboxEvent) return res.status(404).json({ error: 'Job not found' });
        
        return res.json({ status: outboxEvent.status });
    } catch(e) {
        return res.status(500).json({ error: 'Error pulling status' });
    }
});

export default router;

