import prisma from '../prisma/prisma.client';
import { LedgerService } from '../modules/ledger/ledger.service';

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
    console.log('[RISK WORKER] Checking for APPROVED_PENDING_EXECUTION records...');

    // Fetch stalled/pending approvals safely
    const pendingReviews = await prisma.riskReview.findMany({
        where: {
            status: 'APPROVED_PENDING_EXECUTION',
            // Simple exponential-style backoff logic could go here based on execution_attempts
            execution_attempts: { lt: 5 }
        },
        take: 10,
        orderBy: { createdAt: 'asc' }
    });

    if (pendingReviews.length === 0) {
        return;
    }

    const ledger = new LedgerService();

    for (const review of pendingReviews) {
        try {
            console.log(`[RISK WORKER] Processing approval execution for: ${review.id}`);

            // 1. Mark attempt atomic update natively
            await prisma.riskReview.update({
                where: { id: review.id },
                data: {
                    execution_attempts: { increment: 1 },
                    last_execution_at: new Date()
                }
            });

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
                // Use the inherited review event ID. If it already executed but we crashed, LedgerService is natively idempotent.
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
                    where: { id: review.id },
                    data: { status: 'COMPLETED' }
                });

                console.log(`[RISK WORKER] successfully cleared and completed review ${review.id}`);
            } else {
                 throw new Error(`Unsupported risk action [${review.action}] for automatic ledger injection.`);
            }

        } catch (error: any) {
            console.error(`[RISK WORKER] Execution failure on review ${review.id}:`, error.message);
            // We do not throw to allow the worker to process the next queue item.
            // On next tick, if attempts < 5, it will retry.
        }
    }
}

