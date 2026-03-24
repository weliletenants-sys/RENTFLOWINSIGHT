const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Initiating bulk verification of all user profiles...');
  const result = await prisma.profiles.updateMany({
    where: {
      verified: false
    },
    data: {
      verified: true
    }
  });
  console.log(`Successfully verified ${result.count} users!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
