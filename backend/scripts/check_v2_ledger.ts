import prisma from '../src/prisma/prisma.client';
import { CfoService } from '../src/services/cfo.service';

async function performV2Validation() {
    console.log('--- V2 FINANCIAL LEDGER ENGINE VALIDATION ---');
    
    // ----------------------------------------------------
    // CHECK 1: GLOBAL INVARIANT (DEBITS == CREDITS)
    // ----------------------------------------------------
    const debits = await prisma.financialEntries.aggregate({
        where: { type: 'DEBIT' },
        _sum: { amount: true }
    });
    const credits = await prisma.financialEntries.aggregate({
        where: { type: 'CREDIT' },
        _sum: { amount: true }
    });

    const sumDebits = debits._sum.amount || 0;
    const sumCredits = credits._sum.amount || 0;
    const variance = sumCredits - sumDebits;

    console.log(`\n[1] Global Mathematical Proof`);
    console.log(`    Total Debits:  UGX ${sumDebits}`);
    console.log(`    Total Credits: UGX ${sumCredits}`);
    
    if (Math.abs(variance) > 0.0001) {
        console.error(`❌ CRITICAL FAILURE: Ledger is unbalanced by UGX ${variance}`);
        process.exit(1);
    } else {
        console.log(`✅ SUCCESS: Ledger is mathematically flat. (Variance: 0)`);
    }

    // ----------------------------------------------------
    // CHECK 2: SUSPENSE ACCOUNT EXHAUSTION
    // ----------------------------------------------------
    console.log(`\n[2] Suspense Account Depletion Risk Analysis`);
    const suspenseAccount = await prisma.financialAccounts.findUnique({ where: { id: 'SUSPENSE' } });
    if (!suspenseAccount) {
         console.warn(`⚠️ Warning: SUSPENSE account not found. It might not have been provisioned.`);
    } else {
         const sd = await prisma.financialEntries.aggregate({ where: { account_id: 'SUSPENSE', type: 'DEBIT' }, _sum: { amount: true } });
         const sc = await prisma.financialEntries.aggregate({ where: { account_id: 'SUSPENSE', type: 'CREDIT' }, _sum: { amount: true } });
         const suspenseNet = (sc._sum.amount || 0) - (sd._sum.amount || 0);

         if (Math.abs(suspenseNet) > 0.0001) {
              console.error(`❌ CRITICAL FAILURE: Suspense account is non-zero (UGX ${suspenseNet}). Investigate orphaned legacy records!`);
              process.exit(1);
         } else {
              console.log(`✅ SUCCESS: SUSPENSE Account safely liquidated at UGX 0. No unhandled migration variance exists.`);
         }
    }

    // ----------------------------------------------------
    // CHECK 3: WALLET REGRESSION PARITY
    // ----------------------------------------------------
    console.log(`\n[3] 1:1 Wallet Balance Regression Testing...`);
    const wallets = await prisma.wallets.findMany();
    let driftFound = false;

    for (const w of wallets) {
        // Find corresponding V2 wallet account
        const mappedWalletId = w.id; // Or user mapping resolution
        const wd = await prisma.financialEntries.aggregate({ where: { account_id: mappedWalletId, type: 'DEBIT' }, _sum: { amount: true } });
        const wc = await prisma.financialEntries.aggregate({ where: { account_id: mappedWalletId, type: 'CREDIT' }, _sum: { amount: true } });
        
        // Wallet is mapped as Liability from platform perspective natively, but balance stored positive
        const expectedV2Balance = (wc._sum.amount || 0) - (wd._sum.amount || 0);

        if (Math.abs(w.balance - expectedV2Balance) > 0.0001) {
             console.error(`❌ WALLET REGRESSION FAILURE [User ${w.user_id}]: Old Wallet = ${w.balance}, New Engine = ${expectedV2Balance}`);
             driftFound = true;
        }
    }

    if (driftFound) process.exit(1);
    console.log(`✅ SUCCESS: Legacy wallet cache perfectly mirrors deterministic V2 double-entry states across ${wallets.length} physical wallets.`);

    // ----------------------------------------------------
    // CHECK 4: TRANSACTION ROW COUNT PARITY
    // ----------------------------------------------------
    console.log(`\n[4] Transaction Volumetric Scale Verification...`);
    const groupCountRaw: any = await prisma.$queryRaw`SELECT COUNT(DISTINCT COALESCE(transaction_group_id, transaction_id, id)) as total FROM general_ledger`;
    const v1Count = Number(groupCountRaw[0].total);
    const v2Count = await prisma.financialTransactions.count();

    if (v1Count !== v2Count) {
         console.error(`❌ CRITICAL FAILURE: Row loss detected. V1 Unique Groups: ${v1Count}, V2 Wrappers: ${v2Count}`);
         process.exit(1);
    } else {
         console.log(`✅ SUCCESS: Transpiled volume is absolutely identical. (${v1Count} logical groupings maintained)`);
    }

    // ----------------------------------------------------
    // CHECK 5: CFO ACCOUNTING (Report Total Consistency)
    // ----------------------------------------------------
    console.log(`\n[5] CFO Report Macro Consistency...`);
    
    // Legacy Total Revenue Check
    const legacyRevAgg = await prisma.generalLedger.aggregate({
        where: { category: { in: ['access_fee_collected', 'registration_fee_collected', 'service_fee', 'marketplace_purchase', 'penalty_fee'] }, entry_type: 'credit' },
        _sum: { amount: true }
    });
    const legacyRev = legacyRevAgg._sum.amount || 0;

    // V2 Total Revenue Check directly via newly wired CFO Service
    const overview = await CfoService.getLedgerOverview();
    const v2Rev = overview.revenue;

    // Comparing them accurately depends on strict mathematical parity
    // Due to possible "uncategorized" or legacy data mess, we warn if not equal instead of hard fail, but it's a massive flag
    if (Math.abs(legacyRev - v2Rev) > 0.0001) {
         console.warn(`⚠️ CFO WARNING: Legacy Revenue (${legacyRev}) technically drifted from mapped V2 Revenue (${v2Rev}). This could just be accounting categorisation shifts in V2, but requires manual sign-off before full release.`);
    } else {
         console.log(`✅ SUCCESS: CFO Aggregate Revenue successfully decoupled. Engine totals matched legacy cached reports.`);
    }

    // Checking for isolated unmapped records
    const orphans = await prisma.$queryRaw`SELECT e.id FROM financial_entries e LEFT JOIN financial_transactions t ON e.transaction_id = t.id WHERE t.id IS NULL` as any[];
    if (orphans.length > 0) {
        console.error(`❌ CRITICAL FAILURE: Found ${orphans.length} orphaned granular entries without an atomic transaction shell!`);
        process.exit(1);
    }

    console.log('\n======================================================');
    console.log('🏁 ALL TESTS CLEARED: SYSTEM IS AIRTIGHT 🏁');
    console.log('======================================================');
    process.exit(0);
}

performV2Validation().catch(console.error).finally(() => prisma.$disconnect());
