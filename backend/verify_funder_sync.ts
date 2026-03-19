import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const funderRoles = await prisma.userRoles.findMany({
    where: { role: 'FUNDER' },
    select: { user_id: true }
  });

  const funderIds = funderRoles.map(r => r.user_id).filter((id): id is string => id !== null);
  
  const profiles = await prisma.profiles.findMany({
    where: { id: { in: funderIds } },
    take: 2,
    select: { email: true, id: true }
  });

  const boundPortfolios = await prisma.investorPortfolios.findMany({
    where: { investor_id: { in: funderIds } },
    take: 2,
    select: { portfolio_code: true, investor_id: true }
  });

  console.log('--- DB SYNC VERIFICATION ---');
  console.log('FUNDER PROFILES:', profiles);
  console.log('BOUND PORTFOLIOS:', boundPortfolios);
}

main().finally(() => prisma.$disconnect());
