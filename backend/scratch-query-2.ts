import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profiles.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
    select: { id: true, created_at: true, email: true, phone: true }
  });
  console.log('Latest 5 profiles:', profiles);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
