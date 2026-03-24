import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  const users = await prisma.profiles.findMany();
  const user = users.find(u => u.email === 'pexpert@gmail.com');
            
  if (!user) {
    console.log('User pexpert@gmail.com not found.');
    return;
  }
  
  console.log('Found user profile:', user.id);
  
  const wallet = await prisma.wallets.findFirst({ where: { user_id: user.id } });
  if (!wallet) {
    console.log('No wallet found for Pexpert!');
    return;
  }
  
  // Find the 'available' bucket
  const availableBucket = await prisma.walletBuckets.findFirst({
    where: { wallet_id: wallet.id, bucket_type: 'available' }
  });
  
  if (availableBucket) {
    await prisma.walletBuckets.update({
      where: { id: availableBucket.id },
      data: { balance: availableBucket.balance + 2000000 }
    });
    console.log('Successfully added 2,000,000 to availableBucket!');
  } else {
    // Create bucket if somehow missing
    await prisma.walletBuckets.create({
      data: {
        wallet_id: wallet.id,
        bucket_type: 'available',
        balance: 2000000
      }
    });
    console.log('Created missing availableBucket with 2,000,000');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
