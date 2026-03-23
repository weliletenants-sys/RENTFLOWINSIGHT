import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.profiles.updateMany({
    where: { phone: '0701355245' },
    data: { role: 'FUNDER' }
  });
  console.log('Explicitly mirrored the FUNDER role onto Pius Doe\'s Profile record.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
