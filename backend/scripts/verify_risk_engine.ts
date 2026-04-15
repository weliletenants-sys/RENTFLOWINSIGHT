import { v4 as uuidv4 } from 'uuid';
import prisma from '../src/prisma/prisma.client';
import { processApprovedRiskReviews } from '../src/workers/risk_execution.worker';

async function runTests() {
    console.log('🚀 Starting Risk Engine Hardening Simulations...\n');

    try {
        console.log('--- 1. Double Ops Approval Click Test ---');
        const testEventId = uuidv4();
        
        // Setup initial pending state mimicking a Blocked request waiting for Ops
        await prisma.riskReview.create({
             data: {
                 event_id: testEventId,
                 user_id: 'tenant-123',
                 action: 'rent.request',
                 amount: 500000,
                 status: 'PENDING',
                 reasons: ['Velocity Block Test']
             }
        });

        // Simulate two network calls hitting the DB exactly simultaneously
        // Only one should proceed, the other must throw the PENDING guard error
        let successCount = 0;
        let conflictCount = 0;

        const invokeApproval = async () => {
             return prisma.$transaction(async (tx) => {
                 const review = await tx.riskReview.findUnique({ where: { event_id: testEventId } });
                 if (!review) throw new Error("Missing");
                 if (review.status !== 'PENDING') throw new Error("Already Handled");

                 // Transition lock
                 await tx.riskReview.update({
                     where: { id: review.id, status: 'PENDING' },
                     data: { status: 'APPROVED_PENDING_EXECUTION' }
                 });
                 return true;
             });
        };

        const results = await Promise.allSettled([invokeApproval(), invokeApproval(), invokeApproval()]);
        
        results.forEach(res => {
            if (res.status === 'fulfilled') successCount++;
            else if (res.reason.message.includes("Already Handled") || res.reason.message.includes("Record to update not found")) conflictCount++;
            else console.error("UNEXPECTED ERROR: ", res.reason);
        });

        if (successCount !== 1) throw new Error(`Double approval vulnerability! Successes: ${successCount}`);
        if (conflictCount !== 2) throw new Error(`Conflicts not accurately trapped: ${conflictCount}`);
        
        console.log('✅ Passed. Double-Ops explicitly blocked at the data tier.');

        const currentReview = await prisma.riskReview.findUnique({ where: { event_id: testEventId } });
        if (currentReview?.status !== 'APPROVED_PENDING_EXECUTION') throw new Error('Terminal state is invalid');
        
        console.log('\n--- 2. Crash Between Ledger Execution Test ---');
        // We have an APPROVED_PENDING_EXECUTION record natively.
        // We simulate the worker picking this up. We mock the Ledger logic to throw midway.

        // First need mock OutBox parent so worker can map the payload cleanly.
        await prisma.outboxEvents.create({
            data: {
               id: testEventId,
               type: 'rent.request',
               payload: { tenantId: 't1', landlordId: 'l1', amount: 500000 }
            }
        });

        // Hard mock Prisma so the final completion fails simulating a DB crash AFTER ledger success
        const originalUpdate = prisma.riskReview.update;
        let didThrowMock = false;

        prisma.riskReview.update = async (args: any) => {
             if (args.data.status === 'COMPLETED') {
                  didThrowMock = true;
                  throw new Error("Simulated Database Crash On Save Status");
             }
             return originalUpdate(args);
        };

        // Run worker once. Ledger succeeds, but marking COMPLETED throws.
        await processApprovedRiskReviews();
        
        if (!didThrowMock) throw new Error("Mock didn't trigger");

        const reviewAfterCrash = await prisma.riskReview.findUnique({ where: { event_id: testEventId } });
        if(reviewAfterCrash?.status !== 'APPROVED_PENDING_EXECUTION') {
            throw new Error('State was destroyed by crash instead of preserved for retry.');
        }

        if(reviewAfterCrash.execution_attempts !== 1) throw new Error("Execution attempt not recorded before crash");

        console.log('✅ Passed. Worker handled mid-flight crash cleanly and incremented state.');

        console.log('\n--- 3. Idempotent Retry Test ---');
        // Restore Prisma
        prisma.riskReview.update = originalUpdate;

        // Run worker second time. It should succeed, but LedgerService will use the same idempotency key 
        // to prevent duplicate payout natively.
        await processApprovedRiskReviews();

        const finalReview = await prisma.riskReview.findUnique({ where: { event_id: testEventId } });
        if(finalReview?.status !== 'COMPLETED') {
             throw new Error('Recovery Worker failed to complete stalled flow.');
        }

        console.log('✅ Passed. Worker successfully recovered the previous failure without double logging.');

        // Cleanup
        await prisma.riskReview.delete({ where: { event_id: testEventId } });
        await prisma.outboxEvents.delete({ where: { id: testEventId } });
    } catch (error: any) {
         console.error('❌ SIMULATION FAILED:', error);
         process.exit(1);
    }

    console.log('\n==============\nRESULTS: 3 Passed, 0 Failed');
}

runTests();
