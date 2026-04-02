const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.profiles.findMany({
      where: {
        OR: [
          { email: { contains: 'pexpert', mode: 'insensitive' } },
          { full_name: { contains: 'pexpert', mode: 'insensitive' } }
        ]
      }
    });

    if (users.length > 0) {
      console.log('Similar users found:');
      console.log(JSON.stringify(users, null, 2));
    } else {
      console.log('No users found containing "pexpert".');
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
