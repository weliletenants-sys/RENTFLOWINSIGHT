import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.profiles.findMany({
      take: 101,
      where: {},
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        is_frozen: true,
        verified: true
      },
      orderBy: { created_at: 'desc' }
    });
    console.log('Success, found', users.length);
  } catch (err) {
    console.error('Prisma Error executing query:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
