import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLedger() {
  const user = await prisma.profiles.findFirst({
    where: { email: 'pexpert@gmail.com' },
    select: { id: true, email: true }
  });
  
  if (!user) return console.log("User not found!");

  const ledger = await prisma.generalLedger.findMany({
    where: { user_id: user.id }
  });
  console.log("Ledger Count:", ledger.length);
  console.log("Ledger Data:", ledger);
}

checkLedger()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
