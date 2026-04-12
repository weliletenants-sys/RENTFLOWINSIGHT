import prisma from '../prisma/prisma.client';
import { EventDispatcher } from '../events/EventDispatcher';

const POLL_INTERVAL_MS = 5000;

export class OutboxWorker {
    private isRunning = false;

    async start() {
        console.log('🚀 Starting Transactional Outbox Worker...');
        this.isRunning = true;
        this.poll();
    }

    stop() {
        console.log('🛑 Stopping Transactional Outbox Worker.');
        this.isRunning = false;
    }

    private async poll() {
        while (this.isRunning) {
            try {
                // 1. Fetch pending bounds safely
                const pendingEvents = await prisma.outboxEvents.findMany({
                    where: { status: 'pending' },
                    orderBy: { created_at: 'asc' },
                    take: 50 // Batch processing
                });

                if (pendingEvents.length > 0) {
                    console.log(`[OUTBOX] Found ${pendingEvents.length} pending events.`);
                }

                for (const event of pendingEvents) {
                    try {
                        // 2. Transmit Event (Simulating Kafka publish via native EventDispatcher node locally)
                        console.log(`[OUTBOX] Publishing event: ${event.event_type} (${event.id})`);
                        EventDispatcher.emit(event.event_type, event.payload);

                        // 3. Mark successful commit boundary
                        await prisma.outboxEvents.update({
                            where: { id: event.id },
                            data: { status: 'sent' }
                        });
                    } catch (publishErr) {
                        console.error(`[OUTBOX] Failed to publish event ${event.id}:`, publishErr);
                        // Optionally implement retry logic or DLQ (Dead Letter Queue) statuses here
                        await prisma.outboxEvents.update({
                            where: { id: event.id },
                            data: { status: 'failed' }
                        });
                    }
                }
            } catch (err) {
                console.error('[OUTBOX] Polling encountered FATAL error:', err);
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
