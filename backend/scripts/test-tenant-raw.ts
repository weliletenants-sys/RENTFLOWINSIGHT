import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.profiles.count({ where: { role: { in: ['TENANT', 'tenant'] } } });
  const rentReqs = await prisma.rentRequests.count();
  const subCharges = await prisma.subscriptionCharges.count();
  
  console.log(`Live Tenant Identities: ${tenants}`);
  console.log(`Rent Requests: ${rentReqs}`);
  console.log(`Subscription Charges: ${subCharges}`);
}

main().finally(() => prisma.$disconnect());
