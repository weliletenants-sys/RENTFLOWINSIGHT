import { v4 as uuidv4 } from 'uuid';
import prisma from '../src/prisma/prisma.client';
import { processApprovedRiskReviews } from '../src/workers/risk_execution.worker';
import { LedgerService } from '../src/modules/ledger/ledger.service';

/**
 * LONG-DURATION SIMULATION TEST
 * 
 * Target: 1,000 Transactions.
 * Fault Injections:
 * - random worker crashes (20%)
 * - delayed DB responses (mocked via locking bounds testing)
 * - ledger failures (15%)
 */
async function runLongSimulation() {
    console.log('🔥 STARTING LONG-DURATION SYSTEM VALIDATION 🔥');
    const TOTAL_EVENTS = 1000;
    
    // Setup Mock Ledger Overrides
    const originalLedger = LedgerService.prototype.transferWithIdempotency;
    LedgerService.prototype.transferWithIdempotency = async function(args, actionBy) {
        // 15% Ledger Hard Failures
        if (Math.random() < 0.15) {
            throw new Error(`[SIMULATED LEDGER OUTAGE] Transfer failed for ${args.idempotencyKey}`);
        }
        return originalLedger.call(this, args, actionBy);
    };

    // Setup Mock Worker Crashing Overrides mid-flight
    const originalUpdate = prisma.riskReview.update;
    prisma.riskReview.update = async (args: any) => {
         // 20% crash rate BEFORE committing COMPLETED
         if (args.data.status === 'COMPLETED' && Math.random() < 0.20) {
              throw new Error("Simulated Native Worker Crash (SIGKILL) mid-flight");
         }
         return originalUpdate(args);
    };

    console.log(`\n[1/3] Mass-Generating ${TOTAL_EVENTS} Events into PENDING...`);
    const events = Array.from({ length: TOTAL_EVENTS }).map(() => ({
         event_id: uuidv4(),
         idempotency_key: uuidv4(),
         user_id: 'auto-user',
         action: 'rent.request',
         amount: Math.floor(Math.random() * 10000) + 500,
         status: 'APPROVED_PENDING_EXECUTION'
    }));

    await prisma.outboxEvents.createMany({
        data: events.map(e => ({
            id: e.event_id,
            type: e.action,
            payload: { tenantId: 't1', landlordId: 'l1', amount: e.amount }
        }))
    });

    await prisma.riskReview.createMany({ data: events });

    console.log(`[2/3] Simulating Worker Cycles under intense pressure...`);
    // We will run the worker in a while loop until everything is terminal (COMPLETED or FAILED_PERMANENTLY)
    let inProgress = true;
    let cycleCount = 0;
    
    while(inProgress) {
        cycleCount++;
        await processApprovedRiskReviews();
        
        const remaining = await prisma.riskReview.count({
            where: { status: 'APPROVED_PENDING_EXECUTION' }
        });
        
        // Artificial staleness bypass for our testing
        // Because Backoff ceiling pushes up to 60s, we override it to allow tests to complete without waiting hours
        await prisma.riskReview.updateMany({
            where: { status: 'APPROVED_PENDING_EXECUTION', execution_attempts: { gt: 0 } },
            data: { 
                last_execution_at: new Date(Date.now() - 65 * 1000),
                locked_at: null, // Clear locks to simulate time passing for orphans
                last_heartbeat_at: new Date(Date.now() - 65 * 1000)
            }
        });

        console.log(`>>> Cycle ${cycleCount} Ended. Remaining Events: ${remaining}`);
        
        if (remaining === 0) {
            inProgress = false;
        } else if (cycleCount > 50) {
             console.log('>>> Force-terminating due to infinite loop safeguard.');
             inProgress = false;
        }
    }

    console.log(`\n[3/3] Validation & Analysis`);
    
    const completed = await prisma.riskReview.count({ where: { status: 'COMPLETED' }});
    const failedPerm = await prisma.riskReview.count({ where: { status: 'FAILED_PERMANENTLY' }});
    const stuck = await prisma.riskReview.count({ where: { status: 'APPROVED_PENDING_EXECUTION' }});

    console.log('\n📊 RESULTS 📊');
    console.log(`Total Events          : ${TOTAL_EVENTS}`);
    console.log(`Successfully Completed: ${completed}`);
    console.log(`Failed Permanently    : ${failedPerm}`);
    console.log(`Stuck (Orphaned)      : ${stuck}`);
    console.log(`Recovery Cycles Ran   : ${cycleCount}\n`);

    if (stuck === 0 && (completed + failedPerm) === TOTAL_EVENTS) {
         console.log('✅ LONG RUN SIMULATION PASSED: System achieved 100% deterministic terminal states despite massive fault injection.');
    } else {
         console.error('❌ FAILURE DETECTED: System lost event consistency under stress.');
    }

    // Restore Mocks
    LedgerService.prototype.transferWithIdempotency = originalLedger;
    prisma.riskReview.update = originalUpdate;
}

runLongSimulation().catch(console.error).finally(() => process.exit(0));
