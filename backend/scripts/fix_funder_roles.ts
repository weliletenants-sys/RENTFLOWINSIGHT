import { PrismaClient } from '@prisma/client';
import process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING FUNDERS IDENTITY RE-ALIGNMENT ---');

  // Step 1: Extract all explicitly assigned Funders inside the Portfolios array
  const activePortfolios = await prisma.investorPortfolios.groupBy({
    by: ['agent_id'],
  });

  const legitimateFunderIds = activePortfolios
    .map(p => p.agent_id)
    .filter(Boolean) as string[];

  console.log(`Discovered ${legitimateFunderIds.length} verified Funders carrying portfolios.`);

  // Step 2: Fetch all matching Users from the Profiles master table
  const unmappedFunders = await prisma.profiles.findMany({
    where: {
      id: { in: legitimateFunderIds },
      NOT: { role: { in: ['FUNDER', 'funder'] } }
    }
  });

  console.log(`Discovered ${unmappedFunders.length} active Funders possessing invalid, legacy, or missing roles!`);

  if (unmappedFunders.length > 0) {
    // Step 3: Mutate and Stamp these global identities natively
    console.log('Applying bulk role transformation on Profiles...');
    const targetQuery = await prisma.profiles.updateMany({
      where: {
        id: { in: unmappedFunders.map(f => f.id) }
      },
      data: {
        role: 'FUNDER'
      }
    });

    console.log(`[SUCCESS] Stamped ${targetQuery.count} ghost Funder profiles efficiently!`);
  } else {
    console.log(`[SUCCESS] No broken identities found!`);
  }

  // Double check how many we formally have globally tracked!
  const finalCount = await prisma.profiles.count({ where: { role: { in: ['FUNDER', 'funder'] } } });
  
  console.log('--- IDENTITY MIGRATION COMPLETE ---');
  console.log(`New Executive Core Database Funder Footprint: ${finalCount} Funders`);
}

main()
  .catch((e) => {
    console.error('Core Script crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
