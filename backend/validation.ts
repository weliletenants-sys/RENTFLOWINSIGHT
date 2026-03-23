import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Phase 3: CFO Reconciliation Matrix...');

  const wallets = await prisma.wallets.findMany();

  let mismatches = 0;
  let verified = 0;

  for (const wallet of wallets) {
    const buckets = await prisma.walletBuckets.findMany({
      where: { wallet_id: wallet.id }
    });

    const sum = buckets.reduce((acc, curr) => acc + curr.balance, 0);

    // Provide a small floating point tolerance just in case of Javascript precision weirdness
    if (Math.abs(wallet.balance - sum) > 0.01) {
      console.error(`🚨 FATAL MISMATCH! Wallet ${wallet.id} (User ID: ${wallet.user_id})`);
      console.error(`  Total Wallet Balance: ${wallet.balance}`);
      console.error(`  SUM of their Buckets: ${sum}`);
      console.error(`  Diff: ${wallet.balance - sum}`);
      mismatches++;
    } else {
      verified++;
    }
  }

  console.log('-------------------------------------------');
  console.log(`✅ VERIFIED ACCOUNTS: ${verified}`);
  console.log(`❌ MISMATCHED ACCOUNTS: ${mismatches}`);
  console.log('-------------------------------------------');

  if (mismatches > 0) {
    console.log('Phase 3 Validation FAILED. Please resolve before locking API rules.');
    process.exit(1);
  } else {
    console.log('Phase 3 Validation PASSED. System is completely mathematically sound.');
  }
}

main()
  .catch((e) => {
    console.error('Validation script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
