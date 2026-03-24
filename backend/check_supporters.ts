import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.userRoles.count({ where: { role: 'FUNDER' } });
  const active = await prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true } });
  console.log(`Total FUNDER (Supporters): ${total}`);
  console.log(`Enabled FUNDER (Supporters): ${active}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
