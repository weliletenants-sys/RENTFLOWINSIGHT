import prisma from '../prisma/prisma.client';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger';

const POLL_INTERVAL_MS = 2000;

// Initialize Redis Connection (Update dynamically for deployment environments)
const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

// Configure BullMQ domain queues
const queues: Record<string, Queue> = {
    'rent-queue': new Queue('rent-queue', { connection }),
    'funding-queue': new Queue('funding-queue', { connection }),
};

// Map Outbox event types to exact queues
const EVENT_ROUTING: Record<string, string> = {
    'rent.requested': 'rent-queue',
    'partner.fund.locked': 'funding-queue'
};

export class OutboxWorker {
    private isRunning = false;

    async start() {
        logger.info('🚀 Starting Transactional Outbox Worker with BullMQ Bridge...');
        this.isRunning = true;
        this.poll();
    }

    stop() {
        logger.info('🛑 Stopping Transactional Outbox Worker.');
        this.isRunning = false;
    }

    private async poll() {
        while (this.isRunning) {
            try {
                // 1. Claim exactly-once using Postgres locking mechanism (Safe concurrently)
                const claimedEvents = await prisma.$queryRaw<any[]>`
                    UPDATE outbox_events
                    SET locked_at = NOW()
                    WHERE id IN (
                        SELECT id FROM outbox_events
                        WHERE status = 'pending' AND locked_at IS NULL
                        ORDER BY created_at ASC
                        FOR UPDATE SKIP LOCKED
                        LIMIT 50
                    )
                    RETURNING *;
                `;

                if (claimedEvents.length > 0) {
                    logger.info(`[OUTBOX] Claimed and locked ${claimedEvents.length} events for processing.`);
                }

                for (const event of claimedEvents) {
                    try {
                        const targetQueueName = EVENT_ROUTING[event.type];
                        if (!targetQueueName) {
                            throw new Error(`No queue route mapped for event.type: ${event.type}`);
                        }

                        const targetQueue = queues[targetQueueName];

                        // 2. Transmit to BullMQ Queue securely
                        logger.info(`[OUTBOX -> BullMQ] Dispatching ${event.type} to ${targetQueueName}`);
                        
                        await targetQueue.add(event.type, event.payload, {
                            jobId: event.id, // Idempotency inheritance directly from DB Outbox lock ID
                            attempts: 5,
                            backoff: { type: 'exponential', delay: 5000 }
                        });

                        // 3. Mark processed
                        await prisma.$queryRaw`
                            UPDATE outbox_events 
                            SET status = 'processed' 
                            WHERE id = ${event.id}::uuid
                        `;
                    } catch (publishErr: any) {
                        logger.error(`[OUTBOX -> BullMQ ERROR] Fast failing event ${event.id}:`, publishErr);
                        
                        await prisma.$queryRaw`
                            UPDATE outbox_events 
                            SET status = 'failed' 
                            WHERE id = ${event.id}::uuid
                        `;
                    }
                }
            } catch (err) {
                logger.error('[OUTBOX POLLING FATAL ERROR]', err);
            }

            // Sleep safely before next sequence
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        }
    }
}

// Instantiate independently if ran locally
if (require.main === module) {
    const worker = new OutboxWorker();
    worker.start();
}

