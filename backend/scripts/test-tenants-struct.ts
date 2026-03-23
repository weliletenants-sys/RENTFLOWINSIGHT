import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p = await prisma.subscriptionCharges.findFirst();
  if (p) {
    console.log("SUBSCRIPTION CHARGE COLS:", Object.keys(p));
  } else {
    console.log("No subscriptionCharges found at all.");
  }
}

main().finally(() => prisma.$disconnect());
