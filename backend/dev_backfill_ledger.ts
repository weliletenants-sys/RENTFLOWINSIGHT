import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillLedger() {
  const user = await prisma.profiles.findFirst({
    where: { email: 'pexpert@gmail.com' }
  });
  
  if (!user) return console.log("User not found!");

  const wallet = await prisma.wallets.findFirst({
    where: { user_id: user.id }
  });

  if (!wallet) return console.log("Wallet not found!");
  
  // Create an available bucket if it doesn't exist to make sure bucket balance = wallet balance
  let availableBucket = await prisma.walletBuckets.findFirst({
    where: { wallet_id: wallet.id, bucket_type: 'available' }
  });

  if (!availableBucket) {
    availableBucket = await prisma.walletBuckets.create({
      data: {
        wallet_id: wallet.id,
        bucket_type: 'available',
        balance: wallet.balance
      }
    });
    console.log("Created missing available bucket mapping.");
  }

  // Insert general ledger deposit event
  const ledger = await prisma.generalLedger.create({
    data: {
      user_id: user.id,
      amount: 2000000,
      direction: 'wallet_in',
      category: 'fund_deposit',
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      source_table: 'wallets',
      reference_id: `DEP${new Date().getTime().toString().slice(-6)}`,
      running_balance: wallet.balance
    }
  });

  console.log("Backfilled Ledger Deposit:", ledger);
}

backfillLedger()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
