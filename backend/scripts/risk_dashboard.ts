import prisma from '../src/prisma/prisma.client';

async function runDashboard() {
    console.log('📊 FINANCIAL RISK ENGINE OBSERVABILITY 📊');
    console.log('=========================================\n');

    // Metrics for Risk Approvals Pipeline
    const pipelineStats = await prisma.riskReview.groupBy({
        by: ['status'],
        _count: {
            id: true,
        },
    });

    console.log('>> PIELPELINE STATE AGGREGATIONS');
    pipelineStats.forEach(stat => {
         console.log(`- ${stat.status.padEnd(30, ' ')} : ${stat._count.id}`);
    });

    const failed = await prisma.riskReview.findMany({ where: { status: 'FAILED_PERMANENTLY'} });
    if(failed.length > 0) {
        console.log(`\n🚨 CRITICAL ALERT: ${failed.length} FAILED_PERMANENTLY actions found requiring manual ops intervention via Playbook.`);
        failed.forEach(f => {
            console.log(`   [ID: ${f.id}] Event: ${f.event_id} | Attempts: ${f.execution_attempts} | Idempotency Key: ${f.idempotency_key}`);
        });
    }

    const stuck = await prisma.riskReview.findMany({ 
        where: { 
             status: 'APPROVED_PENDING_EXECUTION', 
             execution_attempts: { gt: 0 } 
        } 
    });
    if (stuck.length > 0) {
        console.log(`\n⚠️ RETRYING TRANSACTIONS:`);
        stuck.forEach(s => {
             console.log(`   [ID: ${s.id}] Status: ${s.status} | Attempts: ${s.execution_attempts} | Idempotency Key: ${s.idempotency_key}`);
        });
    }

    // Metrics for Execution Deadlocks
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const stuckLocks = await prisma.riskReview.count({
        where: {
             locked_at: { lt: thirtySecondsAgo },
             status: 'APPROVED_PENDING_EXECUTION'
        }
    });

    console.log(`\n>> LOCK CONTROLS`);
    console.log(`- Stale Locks (Orphaned due to Worker Crash): ${stuckLocks}`);

    // Risk Engine Overall Metrics
    const decisions = await prisma.riskLog.groupBy({
        by: ['decision', 'rule_version'],
        _count: { id: true }
    });

    console.log(`\n>> ENGINE DECISION HISTORY (Rule Drift)`);
    decisions.forEach(d => {
         console.log(`- [${d.rule_version}] ${d.decision.padEnd(10, ' ')} : ${d._count.id}`);
    });

    console.log('\n=========================================');
}

runDashboard().catch(console.error).finally(() => process.exit(0));
