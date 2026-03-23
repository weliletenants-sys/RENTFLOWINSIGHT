import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const profile = await prisma.profiles.findFirst();
  console.log('Columns:', Object.keys(profile || {}));
}
main().finally(() => prisma.$disconnect());
