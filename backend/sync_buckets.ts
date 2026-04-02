import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Synchronizing Wallet Buckets & Balances for all funders...');

  const wallets = await prisma.wallets.findMany();
  let updatedCount = 0;

  for (const wallet of wallets) {
    // 1. Get total invested amount for this user
    let totalInvested = 0;
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: wallet.user_id, status: { in: ['active', 'ACTIVE'] } }
    });
    
    portfolios.forEach(p => {
      totalInvested += Number(p.investment_amount);
    });

    // 2. Ensure all buckets exist
    const bucketTypes = ['available', 'invested', 'commission', 'reserved', 'savings'];
    const existingBuckets = await prisma.walletBuckets.findMany({
      where: { wallet_id: wallet.id }
    });

    // For any missing bucket, create it
    for (const bType of bucketTypes) {
      if (!existingBuckets.find(b => b.bucket_type === bType)) {
        await prisma.walletBuckets.create({
          data: { wallet_id: wallet.id, bucket_type: bType, balance: 0 }
        });
      }
    }

    // 3. We know SSENKAALI's wallet string literal balance was 50,000,000 because we ran credit.ts
    // Let's assume `wallet.balance` BEFORE fix was exactly their available cash (since it was 0 initially for everyone).
    let baseAvailable = wallet.balance || 0;
    
    // If we previously ran credit, we added 50M to wallet.balance but failed to add to bucket. 
    // Now we explicitly set the available bucket to that baseAvailable amount.
    const availableBucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'available' }
    });
    if (availableBucket) {
        await prisma.walletBuckets.update({
            where: { id: availableBucket.id },
            data: { balance: baseAvailable }
        });
    }

    // Update the invested bucket
    const investedBucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'invested' }
    });
    if (investedBucket) {
        await prisma.walletBuckets.update({
            where: { id: investedBucket.id },
            data: { balance: totalInvested }
        });
    }

    // 4. Update the master wallet balance to be the true Total Value (Available + Invested)
    if (totalInvested > 0 || baseAvailable > 0) {
        await prisma.wallets.update({
            where: { id: wallet.id },
            data: { 
                balance: baseAvailable + totalInvested,
                updated_at: new Date().toISOString()
            }
        });
        updatedCount++;
    }
  }

  console.log(`✅ Fully synchronized buckets and principal totals for ${updatedCount} active wallets.`);
}

main().finally(() => prisma.$disconnect());
