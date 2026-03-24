import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  // Find the exact user table name dynamically or try `users` vs `user`
  const users = await prisma.profiles.findMany();
  console.log('All user emails:', users.map(u => u.email));
  const user = users.find(u => u.email === 'pexpert@gmail.com');
            
  if (!user) {
    console.log('User pexpert@gmail.com not found.');
    return;
  }
  
  console.log('Found user:', user.id);
  
  const pendingDeps = await prisma.pendingWalletOperations.findMany({
    where: { user_id: user.id, category: 'deposit' }
  });
  
  console.log('Found pending deposits:', pendingDeps.length);
  
  for (const dep of pendingDeps) {
    if (dep.status.includes('pending')) {
      await prisma.pendingWalletOperations.update({
        where: { id: dep.id },
        data: { status: 'approved_coo' }
      });
      console.log('Updated operation status to approved_coo for deposit:', dep.id);
      
      const amt = Number(dep.amount);
      const wallet = await prisma.wallets.findFirst({ where: { user_id: user.id } });
      if (wallet) {
        await prisma.wallets.update({
          where: { id: wallet.id },
          data: { 
            balance: wallet.balance + amt
          }
        });
        console.log('Updated existing wallet balance. +', amt);
      } else {
        await prisma.wallets.create({
          data: {
            user_id: user.id,
            balance: amt,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
        console.log('Created new wallet with balance:', amt);
      }
    } else {
      console.log('Deposit already not pending:', dep.id, dep.status);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
