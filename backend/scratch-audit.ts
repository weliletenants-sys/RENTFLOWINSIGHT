import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const migrations = await prisma.auditLogs.findMany({
    where: {
      action_type: { in: ['SILENT_MIGRATION', 'PROFILE_SYNC'] }
    },
    orderBy: { id: 'desc' }, // Or however we sort them
    take: 5
  });
  console.log('Recent Migration/Sync Logs:', JSON.stringify(migrations, null, 2));

  // also lets get latest sessions? 
  // actually just the logs should be enough to prove it hit AWS
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
