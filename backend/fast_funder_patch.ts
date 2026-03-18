import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Fast Funder Sync...');

  // 1. Get explicitly FUNDER roles
  const funderRolesList = await prisma.userRoles.findMany({
    where: { role: 'FUNDER' },
    select: { user_id: true }
  });
  
  const targetIds = funderRolesList.map(r => r.user_id).filter(id => id !== null) as string[];

  console.log(`Discovered ${targetIds.length} FUNDER exact profiles. Injecting batch SQL string...`);

  // 2. Perform a massive multi-update natively across the Profiles array in 1 query payload!
  if (targetIds.length > 0) {
    const result = await prisma.profiles.updateMany({
      where: { id: { in: targetIds } },
      data: { role: 'FUNDER' }
    });
    console.log(`✅ Mass Hydration Complete - synced ${result.count} Funder profiles!`);
  } else {
    console.log('No Funder profiles required hydration.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
