import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  try {
    const res = await prisma.rolePermissions.findMany({
      where: { role: { name: 'COO' } },
      include: { permission: true }
    });
    console.log('success', res);
  } catch (e) {
    console.error('fail', e);
  }
}
run();
