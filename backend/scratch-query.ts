import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profiles.findMany({
    orderBy: { created_at: 'desc' },
    take: 3
  });
  console.log(JSON.stringify(profiles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
