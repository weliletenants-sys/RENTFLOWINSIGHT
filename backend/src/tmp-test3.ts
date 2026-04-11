import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const p = await prisma.permissions.findMany();
  console.log('All permissions:', p.map((x: any) => x.system_name));
}
run();
