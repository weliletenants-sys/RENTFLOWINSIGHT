import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.profiles.findFirst({
      where: { phone: '256701355245' }
    });

    if (!profile) {
      console.log('Profile not found.');
      return;
    }

    const wallet = await prisma.wallets.findFirst({
      where: { user_id: profile.id }
    });

    if (!wallet) {
      console.log('Wallet not found.');
      return;
    }

    const updatedWallet = await prisma.wallets.update({
      where: { id: wallet.id },
      data: { 
        balance: { increment: 50000000 }, 
        updated_at: new Date().toISOString() 
      }
    });

    const bucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    if (bucket) {
      await prisma.walletBuckets.update({
        where: { id: bucket.id },
        data: { 
          balance: { increment: 50000000 }
        }
      });
    }

    console.log(`Successfully credited 50,000,000 to ${profile.full_name}'s wallet!`);
    console.log(`New Balance: ${updatedWallet.balance}`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
