import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const charge = await prisma.subscriptionCharges.findFirst();
  console.log(JSON.stringify(charge, null, 2));
}

main().finally(() => prisma.$disconnect());
