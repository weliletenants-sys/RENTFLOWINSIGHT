import axios from 'axios';

// The precise isolated Rent Payment endpoint wired inside the Native DDD API
const API_URL = 'http://localhost:3000/api/v2/tenants/rent/pay';
// Simulated active authenticated header for a tenant profile 
const HEADERS = {
    Authorization: `Bearer YOUR_MOCK_TENANT_JWT_HERE`,
    'Content-Type': 'application/json'
};

const SINGLE_PAYMENT_AMOUNT = 500000;
const SIMULTANEOUS_BOMBS = 10;

async function executeConcurrencyTest() {
    console.log('=================================');
    console.log('🔥 PHASE 5: CONCURRENCY STRESS BOMB');
    console.log(`📡 Firing ${SIMULTANEOUS_BOMBS} concurrent POST requests against PostgreSQL...`);
    console.log('=================================');

    const requests = Array.from({ length: SIMULTANEOUS_BOMBS }, (_, i) => {
        // Enforcing parallel asynchronous Promise blocks without awaiting sequentially!
        return axios.post(API_URL, {
            amount: SINGLE_PAYMENT_AMOUNT,
            paymentMethodToken: `SIMULATED_TOKEN_${i}`
        }, { headers: HEADERS }).catch(e => e.response || { status: 500, data: e.message });
    });

    const start = Date.now();
    
    // 🔥 FIRE SIMULTANEOUSLY
    const responses = await Promise.all(requests);
    
    const duration = Date.now() - start;

    console.log(`\n⏳ Transaction block resolved in ${duration}ms!`);
    console.log('\n📊 DISTRIBUTION METRICS:');

    let successCount = 0;
    let failCount = 0;
    let lockExhaustionCount = 0;

    responses.forEach((res, i) => {
        if (res.status === 200) {
            successCount++;
        } else if (res.status === 400 || res.status === 409) {
            failCount++;
        } else {
            lockExhaustionCount++;
            console.log(`[REQ ${i}] -> Threw ${res.status}: ${JSON.stringify(res.data)}`);
        }
    });

    console.log(`\n✅ Successful Executions: ${successCount}`);
    console.log(`⛔ Native Application Blocks (e.g., Insufficient Funds): ${failCount}`);
    console.log(`🚨 Lock Exhaustions (DB Contention / 500s): ${lockExhaustionCount}`);

    console.log('\n=================================');
    if (successCount > 1) {
        console.error('❌ FATAL FLAW: Double-Spend Condition DETECTED! The Row Level Locks FAILED!');
    } else if (successCount === 1) {
        console.log('✅ PASS: Only exactly ONE transaction successfully passed the row locks gracefully.');
    } else {
        console.log('⚠️ NEUTRAL: All transactions blocked or database offline entirely.');
    }
    console.log('=================================\n');
}

executeConcurrencyTest();
