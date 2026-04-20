import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profiles.findMany({
    orderBy: { last_active_at: 'desc' },
    select: { id: true, created_at: true, last_active_at: true, email: true },
    take: 5
  });
  console.log('Latest active profiles:', profiles);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
