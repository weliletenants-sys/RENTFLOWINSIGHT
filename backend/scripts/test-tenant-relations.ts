import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const charges = await prisma.subscriptionCharges.findMany();
  const userIds = Array.from(new Set(charges.map(c => c.user_id).filter(id => id)));
  
  console.log('--- FOUND USER IDS ON CHARGES ---');
  console.log(userIds);
  
  if (userIds.length > 0) {
    const profiles = await prisma.profiles.findMany({
      where: { id: { in: userIds } }
    });
    console.log('\n--- REAL PROFILES FOR THESE IDS ---');
    console.log(`Found ${profiles.length} profiles.`);
    console.log(profiles);
  }
}

main().finally(() => prisma.$disconnect());
