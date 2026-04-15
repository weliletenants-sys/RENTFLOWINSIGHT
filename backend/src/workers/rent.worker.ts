import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import prisma from '../prisma/prisma.client';
import logger from '../utils/logger';
import { LedgerService } from '../modules/ledger/ledger.service';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

// Create explicit System User mapping exactly to Phase 3 identity rules
const SYSTEM_USER = {
    id: 'system-worker-rent',
    role: 'ADMIN',
    scopes: ['ledger.transfer.execute', 'rent.process']
};

export const rentWorker = new Worker('rent-queue', async (job: Job) => {
    const { id: eventId, name: eventType, data: payload } = job;

    logger.info(`[RENT-WORKER] Processing Job ${eventId} (${eventType})`);

    // 1. Worker-Level Idempotency Guard (Strict Replay Safety)
    const alreadyProcessed = await prisma.processedEvents.findUnique({
        where: { event_id: eventId as string }
    });

    if (alreadyProcessed) {
        logger.info(`[RENT-WORKER] Job ${eventId} was already processed successfully. Skipping execution.`);
        return { skipped: true, reason: 'Already in processed_events' };
    }

    try {
        if (eventType === 'rent.requested') {
            const { tenantId, amount, landlordId } = payload;
            logger.info(`[RENT-WORKER] Evaluating physical risk boundary for Tenant: ${tenantId}`);
            
            // 2. Gatekeeper Layer (Fail closed)
            const riskService = require('../modules/risk/risk.service').RiskService;
            const risk = new riskService();
            
            let evaluatedContext;
            try {
               evaluatedContext = await risk.evaluate({
                   eventId: eventId as string,
                   userId: tenantId, 
                   action: 'rent.request',
                   amount: amount
               });
            } catch (err: any) {
               logger.error(`[RISK FAILURE] Engine malfunction on ${eventId}`, err);
               throw new Error('Risk engine failure'); // RETRY LOOP
            }

            // Route execution cleanly handling Block/Review business states safely.
            if (evaluatedContext.decision === 'BLOCK') {
                logger.warn(`[RISK BLOCKED] Rent pipeline forcibly dropped for EVENT [${eventId}] Reasons: ${evaluatedContext.reasons.join(', ')}`);
                await prisma.processedEvents.create({ data: { event_id: eventId as string } });
                return { status: 'blocked', reasons: evaluatedContext.reasons }; 
            }

            if (evaluatedContext.decision === 'REVIEW') {
                logger.warn(`[RISK REVIEW] Sidelining ${eventId} structurally for C-Suite inspection natively.`);
                
                // Deterministic Review Hub
                const existingReview = await prisma.riskReview.findUnique({ where: { event_id: eventId as string }});
                if (!existingReview) {
                    await prisma.riskReview.create({
                        data: {
                            event_id: eventId as string,
                            user_id: tenantId,
                            action: 'rent.request',
                            amount: amount,
                            status: 'PENDING',
                            reasons: evaluatedContext.reasons
                        }
                    });
                    
                    const { Queue } = require('bullmq');
                    // Side-step connection instantiation via global mapped queues
                    const reviewQueue = new Queue('review-queue', { connection });
                    await reviewQueue.add('risk-review', payload, { jobId: eventId as string }); // Idempotent pushing
                }

                await prisma.processedEvents.create({ data: { event_id: eventId as string } });
                return { status: 'review_required' };
            }

            // 3. Replay-safe ledger action (ALLOW status mapped logically)
            const ledger = new LedgerService();
            await ledger.transferWithIdempotency(
                {
                    idempotencyKey: `rent.transfer.${eventId}`, // Safe tie back to event scope
                    amount: amount,
                    fromAccountId: tenantId, 
                    toAccountId: landlordId, 
                    category: 'rent_payment',
                    sourceTable: 'rent_pipeline',
                    sourceId: eventId as string
                },
                SYSTEM_USER
            );
        }

        // 4. Mark processed natively isolating duplications natively
        await prisma.processedEvents.create({
            data: { event_id: eventId as string }
        });

        logger.info(`[RENT-WORKER] Job ${eventId} completed successfully.`);
        return { status: 'SUCCESS' };
        
    } catch (err: any) {
        logger.error(`[RENT-WORKER] Fatal Error on Job ${eventId}:`, err);
        throw err; // Throw propagates back to BullMQ to increment retry tracker and DLQ routing
    }
}, { connection });

// Handle BullMQ Worker Lifecycle States
rentWorker.on('completed', job => {
    logger.info(`[JOB COMPLETED] ${job.id}`);
});

rentWorker.on('failed', (job, err) => {
    console.error('[WORKER FAILED]', job?.id, err.message);
});

