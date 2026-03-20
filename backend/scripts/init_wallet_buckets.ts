import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWalletBuckets() {
  console.log('Starting internal wallet buckets seeding...');

  try {
    const wallets = await prisma.wallets.findMany();
    console.log(`Found ${wallets.length} wallets to process.`);

    let processedCount = 0;
    let missingCount = 0;

    for (const wallet of wallets) {
      // Check if buckets already exist
      const existingBuckets = await prisma.walletBuckets.findMany({
        where: { wallet_id: wallet.id }
      });

      if (existingBuckets.length > 0) {
        console.log(`Wallet ${wallet.id} already has buckets. Skipping.`);
        continue;
      }

      // We explicitly create MAIN, RESERVE, and FEE buckets for every wallet as requested
      // The entire balance sits in MAIN for normal wallets
      await prisma.walletBuckets.createMany({
        data: [
          {
            wallet_id: wallet.id,
            bucket_type: 'MAIN',
            balance: wallet.balance
          },
          {
            wallet_id: wallet.id,
            bucket_type: 'RESERVE',
            balance: 0
          },
          {
            wallet_id: wallet.id,
            bucket_type: 'FEE',
            balance: 0
          }
        ]
      });

      missingCount++;
      processedCount++;
    }

    console.log(`Seeding completed. Initialized buckets for ${missingCount} wallets.`);
  } catch (error) {
    console.error('Failed to seed wallet buckets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedWalletBuckets();
