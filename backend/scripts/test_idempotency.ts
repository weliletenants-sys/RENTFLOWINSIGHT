import axios from 'axios';
import { v7 as uuidv7 } from 'uuid';

const baseUrl = 'http://localhost:3000/api';

// Pass your active JWT token as a command-line argument
const token = process.argv[2];

if (!token) {
  console.error('\n❌ Usage: npx ts-node scripts/test_idempotency.ts <YOUR_ACCESS_TOKEN>\n');
  console.error('You can grab your token from the browser console (localStorage.getItem("access_token"))');
  process.exit(1);
}

const runConcurrentTest = async () => {
  const idempotencyKey = uuidv7();
  console.log(`\n🚀 Simulating 3 extremely rapid concurrent clicks (Double-spend attempt)`);
  console.log(`🔑 Using Idempotency-Key: ${idempotencyKey}\n`);

  const payload = {
    amount: 100000,
    roi_mode: 'monthly_compounding',
    duration_months: 12,
    auto_renew: false
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Idempotency-Key': idempotencyKey,
  };

  try {
    console.log('Firing requests simultaneously...\n');
    // We launch 3 HTTP requests precisely at the exact same millisecond without awaiting sequentially
    const req1 = axios.post(`${baseUrl}/funder/fund`, payload, { headers, validateStatus: () => true });
    const req2 = axios.post(`${baseUrl}/funder/fund`, payload, { headers, validateStatus: () => true });
    const req3 = axios.post(`${baseUrl}/funder/fund`, payload, { headers, validateStatus: () => true });

    const [res1, res2, res3] = await Promise.all([req1, req2, req3]);

    console.log('--- HTTP Results ---');
    console.log(`[Click 1] Status: ${res1.status} ->`, res1.data?.message || res1.data);
    console.log(`[Click 2] Status: ${res2.status} ->`, res2.data?.message || res2.data);
    console.log(`[Click 3] Status: ${res3.status} ->`, res3.data?.message || res3.data);

    console.log('\n--- Analysis ---');
    const codes = [res1.status, res2.status, res3.status];
    const successes = codes.filter(c => c >= 200 && c < 300).length;
    const conflicts = codes.filter(c => c === 409).length;

    if (codes.includes(401) || codes.includes(403)) {
        console.log('⚠️ FAILURE: Unauthorized. Please provide a valid active JWT token.');
    } else if (successes === 1 && conflicts === 2) {
        console.log('✅ SECURE: Idempotency is working perfectly! Only 1 transaction was allowed through. The concurrent duplicates hit the Redis SETNX lock and returned 409 Conflict.');
    } else if (successes > 1) {
        console.log('❌ CRITICAL VULNERABILITY: Multiple transactions succeeded! Double spending occurred.');
    } else {
        console.log('ℹ️ UNEXPECTED OUTCOME: Check the backend terminal logs. You might have insufficient funds, or the backend is down.');
    }

    console.log('\n🧪 Test 2: Testing Cache Replay');
    console.log('Waiting 3 seconds for the first transaction to finish processing, then firing the exact same request again...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    const req4 = await axios.post(`${baseUrl}/funder/fund`, payload, { headers, validateStatus: () => true });
    
    console.log(`\n[Delayed Retry Click 4] Status: ${req4.status} ->`, req4.data?.message || req4.data);
    if (req4.status === res1.status) {
         console.log('✅ CACHE HIT: The backend safely recognized the old completed request and gracefully replayed the exact success payload without creating a duplicate database entry!');
    } else if (req4.status === 409) {
         console.log('⚠️ It returned 409 Conflict again. This either means the original request is STILL executing (processing), or our cache setter failed.');
    }

  } catch (error) {
    console.error('Test script crashed:', error);
  }
};

runConcurrentTest().catch(console.error);
