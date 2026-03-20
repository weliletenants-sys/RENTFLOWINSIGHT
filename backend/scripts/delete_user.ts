import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteUser() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npx ts-node scripts/delete_user.ts <email>');
    process.exit(1);
  }

  try {
    const profile = await prisma.profiles.findFirst({ where: { email } });
    if (!profile) {
      console.log(`✅ User ${email} does not exist in the database.`);
      return;
    }

    console.log(`Deleting data for user: ${email} (ID: ${profile.id})...`);
    
    // Delete related records safely (Roles, Sessions, Wallets, etc.)
    await prisma.userRoles.deleteMany({ where: { user_id: profile.id } });
    await prisma.sessions.deleteMany({ where: { user_id: profile.id } });
    
    const wallets = await prisma.wallets.findMany({ where: { user_id: profile.id } });
    for (const w of wallets) {
      await prisma.walletBuckets.deleteMany({ where: { wallet_id: w.id } });
    }
    await prisma.wallets.deleteMany({ where: { user_id: profile.id } });
    
    // Finally, delete the master profile
    await prisma.profiles.delete({ where: { id: profile.id } });

    console.log(`✅ User ${email} has been completely removed from the database!`);
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
