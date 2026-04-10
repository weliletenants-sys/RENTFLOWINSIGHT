import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const p = await prisma.profiles.findFirst({ where: { email: 'admin@welile.com' } });
  console.log('User Role:', p?.role);
}
run();
