import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runIntegrityCheck() {
  console.log('--- Running General Ledger Integrity Check ---');
  
  // 1. Total Net Balance must equal 0 exactly.
  const creditsResult = await prisma.generalLedger.aggregate({
    where: { entry_type: 'credit' },
    _sum: { amount: true }
  });

  const debitsResult = await prisma.generalLedger.aggregate({
    where: { entry_type: 'debit' },
    _sum: { amount: true }
  });

  const totalCredits = creditsResult._sum.amount || 0;
  const totalDebits = debitsResult._sum.amount || 0;

  console.log(`Total Credits: ${totalCredits}`);
  console.log(`Total Debits:  ${totalDebits}`);
  
  const diff = totalCredits - totalDebits;
  if (diff === 0) {
    console.log('✅ Global Net Balance is ZERO (Perfect Double-Entry Alignment)');
  } else {
    console.error(`❌ Ledger Inconsistency detected. Drift Amount: ${diff}`);
  }

  // 2. Pending Top-Up Suspense Accounts
  const pendingCreditsResult = await prisma.generalLedger.aggregate({
    where: { category: 'pending_portfolio_topup', entry_type: 'credit' },
    _sum: { amount: true }
  });
  const pendingDebitsResult = await prisma.generalLedger.aggregate({
    where: { category: 'pending_portfolio_topup', entry_type: 'debit' },
    _sum: { amount: true }
  });

  const pendingCreds = pendingCreditsResult._sum.amount || 0;
  const pendingDebs = pendingDebitsResult._sum.amount || 0;

  console.log(`\n--- Suspense Accounts (Pending Topup Validation) ---`);
  console.log(`Suspense Created (Credit Liability): ${pendingCreds}`);
  console.log(`Suspense Merged (Debit Out):  ${pendingDebs}`);
  const remainingSuspense = pendingCreds - pendingDebs;
  console.log(`Total Outstanding Suspense Unmerged: ${remainingSuspense}`);

  process.exit(diff === 0 ? 0 : 1);
}

runIntegrityCheck().catch(e => {
  console.error('Test Failed:', e);
  process.exit(1);
});
