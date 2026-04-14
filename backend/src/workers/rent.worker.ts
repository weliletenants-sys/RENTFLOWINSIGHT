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
            logger.info(`[RENT-WORKER] Processing rent transfer for Tenant: ${tenantId}`);
            
            // Replay-safe ledger action, strictly passing the actor
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

        // 2. Mark processed natively
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

