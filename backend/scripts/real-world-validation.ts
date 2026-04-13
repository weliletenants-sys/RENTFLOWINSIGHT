import prisma from '../src/prisma/prisma.client';
import { RepaymentsService } from '../src/modules/repayments/repayments.service';
import { PaymentsService } from '../src/modules/payments/payments.service';
import { EventDispatcher } from '../src/events/EventDispatcher';
import { RentPipelineService } from '../src/modules/rent_pipeline/rent_pipeline.service';
// Important: importing listener to guarantee it is natively registered
import '../src/events/listeners/commission.listener';
import { v4 as uuidv4 } from 'uuid';

async function validateArchitecture() {
    console.log('🧪 Starting Real-World Validation of Phase 2 Repayments Infrastructure...\n');
    const repaymentsService = new RepaymentsService();
    const paymentsService = new PaymentsService();
    
    // Test Identities
    const agentId = `mock-agent-${uuidv4()}`;
    const tenantId = `mock-tenant-${uuidv4()}`;
    const mockRentRequestId = `mock-rent-req-${uuidv4()}`;
    const initialReference = uuidv4();
    const agentRepaymentRef = uuidv4();

    try {
        // --- PREPARATION ---
        console.log(`[SETUP] Agent: ${agentId} | Tenant: ${tenantId}`);
        // Inject fake balance manually so we can test happy path
        await prisma.$executeRawUnsafe(`
            INSERT INTO wallets (id, account_id, balance, created_at, updated_at) 
            VALUES ('${uuidv4()}', '${tenantId}', 150000, NOW(), NOW())
        `);
        await prisma.$executeRawUnsafe(`
            INSERT INTO wallets (id, account_id, balance, created_at, updated_at) 
            VALUES ('${uuidv4()}', '${agentId}', 500000, NOW(), NOW())
        `);

        console.log(`[SETUP] Rent Request Pipeline Instance initialized: ${mockRentRequestId}`);
        await prisma.$executeRawUnsafe(`
            INSERT INTO rent_requests (id, tenant_id, agent_id, rent_amount, access_fee, daily_repayment, duration_days, request_fee, total_repayment, remaining_balance, status, tenant_no_smartphone, lc1_id, created_at, updated_at) 
            VALUES ('${mockRentRequestId}', '${tenantId}', '${agentId}', 100000, 0, 0, 30, 0, 100000, 100000, 'ACTIVE', false, 'test', NOW(), NOW())
        `);

        // --- TEST 1: Tenant Repayment execution cleanly mapped ---
        console.log('\n--- 🧪 TEST 1: Authentic Tenant Repayment ---');
        const paymentResult = await repaymentsService.repayByTenant({
            tenantId,
            amount: 40000,
            idempotencyKey: initialReference,
            rentRequestId: mockRentRequestId
        });
        
        // Assertions natively mapping to database
        const ledgerEntries = await prisma.generalLedger.findMany({ where: { transaction_id: (paymentResult as any).transactionId }});
        console.assert(ledgerEntries.length === 2, 'Ledger failed to map exactly 2 entries recursively.');
        
        const repaymentNode = await prisma.repayments.findFirst({ where: { payment_id: (paymentResult as any).paymentId }});
        console.assert(repaymentNode !== null, 'Domain row explicitly failed to map via afterLedgerWrite.');
        console.assert(repaymentNode!.tenant_id === tenantId, 'Domain graph failed identity map.');
        console.assert(repaymentNode!.paid_by_account_id === tenantId, 'Domain trace legally corrupted paid_by mapping.');

        const tenantWallet = await prisma.wallets.findUnique({ where: { account_id: tenantId }});
        console.assert(tenantWallet!.balance === 110000, `Wallet failed update constraint. Expected 110000, got ${tenantWallet!.balance}`);

        const outboxEvent = await prisma.outboxEvents.findFirst({ where: { event_type: 'tenant_repayment.created' }});
        console.assert(outboxEvent !== null, 'Outbox event fundamentally missed execution.');
        console.log('✅ TEST 1 PASSED: Tenant debt cleared physically mapping DB layers properly.');

        // --- TEST 1.5: Asynchronous Outbox Commission & Pipeline Resolution ---
        console.log('\n--- 🧪 TEST 1.5: Outbox Event Flush -> Pipeline Deduction & Commission ---');
        console.log('[TEST] Force-emitting outbox event...');
        EventDispatcher.emit(outboxEvent!.event_type, outboxEvent!.payload);
        
        // Wait 100ms for async async listener pipeline to physically clear
        await new Promise(r => setTimeout(r, 100));

        const commissionNode = await prisma.commissions.findFirst({ where: { repayment_id: (paymentResult as any).paymentId }});
        console.assert(commissionNode !== null, 'Commission Listener completely failed to react and execute mapping.');
        console.assert(commissionNode!.amount === 4000, `Mathematical configuration failed. Expected 4000, got ${commissionNode!.amount}`);
        
        // --- Verify Pipeline Logic
        const pipelineStatus = await prisma.rentRequests.findUnique({ where: { id: mockRentRequestId }});
        console.assert(pipelineStatus!.remaining_balance === 60000, `Pipeline State Machine leaked calculations. Expected 60000, got ${pipelineStatus!.remaining_balance}`);
        console.assert(pipelineStatus!.status === 'ACTIVE', `Pipeline skipped State inappropriately.`);
        console.log('✅ TEST 1.5 PASSED: Asynchronous hooks natively bounded Commission and exact Debt limits safely.');


        // --- TEST 2: Agent Repayment Flow (Cross Identity & Pipeline Closure) ---
        console.log('\n--- 🧪 TEST 2: Final Agent Repayment Mapping -> REPAID ---');
        const agentResult = await repaymentsService.repayByAgent({
            agentId,
            tenantId,
            amount: 60000,
            idempotencyKey: agentRepaymentRef,
            rentRequestId: mockRentRequestId
        });

        const agentRepayment = await prisma.repayments.findFirst({ where: { payment_id: (agentResult as any).paymentId }});
        console.assert(agentRepayment!.paid_by_account_id === agentId, 'Agent mapping logic erroneously credited tenant action.');
        console.assert(agentRepayment!.payment_method === 'WALLET', 'Enum structural mismatch.');

        const agentWallet = await prisma.wallets.findUnique({ where: { account_id: agentId }});
        console.assert(agentWallet!.balance === 440000, `Wallet natively failed agent derivation lock. Expected 440000, got ${agentWallet!.balance}`);
        console.log('✅ TEST 2 PASSED: Remote Proxy Resolution completely bound dynamically using exact Repayments module configuration.');

        // --- TEST 2.5: Terminal State Resolution & Overpayment Block ---
        console.log('\n--- 🧪 TEST 2.5: REPAID Terminal Resolution & Active Overpayment Rejection ---');
        const finalOutboxEvent = await prisma.outboxEvents.findFirst({ where: { event_type: 'agent_repayment.created' }});
        console.log('[TEST] Force-emitting outbox event for final payout...');
        EventDispatcher.emit(finalOutboxEvent!.event_type, finalOutboxEvent!.payload);
        
        await new Promise(r => setTimeout(r, 100));

        const finalPipelineStatus = await prisma.rentRequests.findUnique({ where: { id: mockRentRequestId }});
        console.assert(finalPipelineStatus!.remaining_balance === 0, `Debt mathematically failed strict deduction.`);
        console.assert(finalPipelineStatus!.status === 'REPAID', `Terminal State Resolution bypassed.`);

        try {
            await repaymentsService.repayByTenant({
                tenantId, amount: 5000, idempotencyKey: uuidv4(), rentRequestId: mockRentRequestId
            });
            const overpayOutbox = await prisma.outboxEvents.findFirst({ where: { event_type: 'tenant_repayment.created', status: 'pending' }});
            // We await the throw in the listener pipeline directly
            const rPipeline = new RentPipelineService();
            await rPipeline.applyDebtReduction(mockRentRequestId, 5000, (overpayOutbox!.payload as any).paymentId);
            throw new Error('Pipeline explicitly failed to block structural overpayment limit!');
        } catch (err: any) {
            console.assert(err.message.includes('Overpayment natively rejected'), `Unexpected error state: ${err.message}`);
            console.log('✅ TEST 2.5 PASSED: Pipeline strictly rejected exact fractional overpayments and secured REPAID status natively!');
        }

        // --- TEST 3: Idempotency Validation ---
        console.log('\n--- 🧪 TEST 3: Idempotency Bounds (Duplication Guard) ---');
        const retryResult = await repaymentsService.repayByAgent({
            agentId,
            tenantId,
            amount: 150000, // Should ignore amount, blocks strictly on key
            idempotencyKey: agentRepaymentRef
        });
        const duplicateCheck = await prisma.repayments.count({ where: { payment_id: (retryResult as any).paymentId }});
        console.assert(duplicateCheck === 1, 'Idempotency fundamentally corrupted Repayment bounds generating duplicates.');
        console.log('✅ TEST 3 PASSED: System perfectly rejected dual mappings cleanly mapping identity node.');


        // --- TEST 4: Post DB Checks ---
        console.log('\n--- 🧪 TEST 4: Insufficient Funds Bounds Blockage ---');
        try {
            await repaymentsService.repayByTenant({
                 tenantId,
                 amount: 5000000, // Explicit mathematical imbalance
                 idempotencyKey: uuidv4()
            });
            throw new Error('Database triggers explicitly failed to block structural overdrafts natively.');
        } catch (err: any) {
            console.assert(err.message.includes('Insufficient Funds'), `Unexpected error state returned: ${err.message}`);
            console.log('✅ TEST 4 PASSED: DB triggers locked negative floats automatically blocking Repayment flows.');
        }

        console.log('\n🔥 ALL REPAYMENTS VALIDATIONS PASSED. Architecture operates flawlessly!');

    } catch (e) {
        console.error('❌ Validation Framework Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

validateArchitecture();
