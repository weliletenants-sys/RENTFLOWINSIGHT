import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Roles Sync Execution...');
  
  // 1. Fetch all UserRoles
  const userRolesList = await prisma.userRoles.findMany({
    select: { user_id: true, role: true }
  });

  console.log(`Discovered ${userRolesList.length} UserRole binding nodes.`);
  let updatedCount = 0;

  for (const mapping of userRolesList) {
    if (!mapping.user_id || !mapping.role) continue;

    try {
      // 2. Perform silent update directly appending 'role' to the Profile table
      await prisma.profiles.update({
        where: { id: mapping.user_id },
        data: { role: mapping.role }
      });
      updatedCount++;
    } catch (e: any) {
      // Ignore P2025 errors safely if Profile no longer exists
      if (e.code !== 'P2025') {
        console.error(`Error migrating role for user ${mapping.user_id}:`, e.message);
      }
    }
  }

  console.log(`✅ Roles Sync Complete - successfully migrated ${updatedCount} designations natively into Profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
