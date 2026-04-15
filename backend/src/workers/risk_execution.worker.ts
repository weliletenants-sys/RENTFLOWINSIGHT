import os from 'os';
import prisma from '../prisma/prisma.client';
import { LedgerService } from '../modules/ledger/ledger.service';

const WORKER_ID = `${os.hostname()}-${process.pid}`;

/**
 * Risk Execution Recovery Worker
 * 
 * Target: Scans continuously for `APPROVED_PENDING_EXECUTION` states.
 * Guarantees:
 * 1. Safe Retries - uses `execution_attempts` and timestamp.
 * 2. Idempotent Executions.
 * 3. Never blocks the HTTP interface on crashes.
 */
export async function processApprovedRiskReviews() {
    console.log(`[RISK WORKER ${WORKER_ID}] Checking for APPROVED_PENDING_EXECUTION records...`);

    // Fetch stalled/pending approvals safely
    // We consider a lock "stale" if last_heartbeat_at is > 30 seconds ago
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

    const pendingReviews = await prisma.riskReview.findMany({
        where: {
            status: 'APPROVED_PENDING_EXECUTION',
            execution_attempts: { lt: 5 },
            OR: [
                { locked_at: null },
                { last_heartbeat_at: { lt: thirtySecondsAgo } }
            ]
        },
        take: 50,
        orderBy: { createdAt: 'asc' }
    });

    if (pendingReviews.length === 0) {
        return;
    }

    const ledger = new LedgerService();

    for (const review of pendingReviews) {
        // Enforce Exponential backoff with a 60-second ceiling
        // delay = Min(2^attempts * 2s, 60s)
        if (review.last_execution_at) {
            const delayMs = Math.min(Math.pow(2, review.execution_attempts) * 2000, 60000);
            const thresholdTime = new Date(review.last_execution_at.getTime() + delayMs);
            if (new Date() < thresholdTime) {
                 continue; // Too soon to retry, backoff applies
            }
        }

        try {
            console.log(`[RISK WORKER ${WORKER_ID}] Processing approval execution for: ${review.id}`);

            // 1. Claim Lock Atomically 
            // Ensures two concurrent workers don't grab the same record via structural ownership.
            const lockResult = await prisma.riskReview.updateMany({
                where: { 
                    id: review.id, 
                    status: 'APPROVED_PENDING_EXECUTION',
                    OR: [
                        { locked_at: null },
                        { last_heartbeat_at: { lt: thirtySecondsAgo } }
                    ]
                },
                data: {
                    locked_at: new Date(),
                    last_heartbeat_at: new Date(),
                    locked_by: WORKER_ID
                }
            });

            // If count is 0, another worker claimed it microseconds before us.
            if (lockResult.count === 0) {
                console.log(`[RISK WORKER ${WORKER_ID}] Skipped ${review.id} - claimed safely by another worker.`);
                continue; 
            }

            // 2. Fetch original context. Currently tightly coupled to rent.request via outbox events.
            if (review.action === 'rent.request') {
                const outboxEvent = await prisma.outboxEvents.findUnique({
                    where: { id: review.event_id }
                });

                if (!outboxEvent) {
                    throw new Error(`Orphaned Risk Event: Outbox core data missing for event [${review.event_id}]`);
                }

                const payload = outboxEvent.payload as any;

                // 3. Physical Idempotent Ledger Execution
                const idempotencyKey = review.idempotency_key || `rent.transfer.${review.event_id}`;
                
                await ledger.transferWithIdempotency({
                    idempotencyKey, 
                    amount: payload.amount,
                    fromAccountId: payload.tenantId, 
                    toAccountId: payload.landlordId, 
                    category: 'rent_payment',
                    sourceTable: 'rent_pipeline',
                    sourceId: review.event_id
                }, {
                    id: review.decidedBy || 'SYSTEM_WORKER', 
                    role: 'FINOPS', 
                    scopes: ['ledger.transfer.execute']
                });

                // 4. Mark terminal phase permanently
                await prisma.riskReview.update({
                    where: { id: review.id, locked_by: WORKER_ID },
                    data: { status: 'COMPLETED', locked_at: null, locked_by: null, last_heartbeat_at: null }
                });

                console.log(`[RISK WORKER ${WORKER_ID}] successfully cleared and completed review ${review.id}`);
            } else {
                 throw new Error(`Unsupported risk action [${review.action}] for automatic ledger injection.`);
            }

        } catch (error: any) {
            console.error(`[RISK WORKER ${WORKER_ID}] Execution failure on review ${review.id}:`, error.message);
            
            // Retry handling - Unlock & backoff
            const nextAttempts = review.execution_attempts + 1;
            const newStatus = nextAttempts >= 5 ? 'FAILED_PERMANENTLY' : 'APPROVED_PENDING_EXECUTION';
            
            await prisma.riskReview.update({
                where: { id: review.id, locked_by: WORKER_ID },
                data: {
                    execution_attempts: { increment: 1 },
                    last_execution_at: new Date(),
                    locked_at: null, // Release lock so it can be retried later
                    locked_by: null,
                    last_heartbeat_at: null,
                    status: newStatus
                }
            });

            if (newStatus === 'FAILED_PERMANENTLY') {
                console.error(`[CRITICAL] RiskReview ${review.id} hit FAILED_PERMANENTLY and requires human intervention.`);
            }
        }
    }
}

