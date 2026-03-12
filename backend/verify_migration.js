const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.profiles.count();
  console.log(`Total profiles in AWS Database: ${count}`);

  const walletsCount = await prisma.wallets.count();
  console.log(`Total wallets in AWS Database: ${walletsCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
