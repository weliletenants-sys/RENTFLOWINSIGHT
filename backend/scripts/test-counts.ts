import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profiles.count();
  const ops = await prisma.virtualOpportunities.count();
  const portfolios = await prisma.investorPortfolios.count();
  
  console.log('--- LIVE AWS DATA COUNTS ---');
  console.log(`Profiles: ${profiles}`);
  console.log(`Portfolios: ${portfolios}`);
  console.log(`Virtual Ops: ${ops}`);
  console.log('---------------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
