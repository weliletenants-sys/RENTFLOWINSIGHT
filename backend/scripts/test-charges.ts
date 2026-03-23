import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const charges = await prisma.subscriptionCharges.count();
  const tenants = await prisma.profiles.count({ where: { role: 'TENANT' } });
  
  console.log(`--- LIVE AWS DATA ---`);
  console.log(`Subscription Charges: ${charges}`);
  console.log(`Tenant Profiles: ${tenants}`);
}

main().finally(() => prisma.$disconnect());
