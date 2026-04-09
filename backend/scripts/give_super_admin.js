const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const phoneToUpdate = '0700000000';
  console.log(`Looking for user with phone: ${phoneToUpdate}...`);
  
  const user = await prisma.profiles.findUnique({
    where: { phone: phoneToUpdate }
  });

  if (!user) {
    console.error('User not found. Cannot update.');
    process.exit(1);
  }

  const updatedUser = await prisma.profiles.update({
    where: { phone: phoneToUpdate },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log(`✅ Success! Updated user ${updatedUser.full_name} (${updatedUser.phone}) to role: ${updatedUser.role}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
