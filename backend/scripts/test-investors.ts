import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p = await prisma.investorPortfolios.findFirst();
  if (p) {
    console.log(Object.keys(p));
  } else {
    console.log("No portfolios found, but trying to read Prisma type definition natively...");
  }
}

main().finally(() => prisma.$disconnect());
