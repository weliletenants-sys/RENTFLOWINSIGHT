import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profiles.findFirst({
    where: { phone: '0701355245' }
  });
  console.log('----------------------------------------');
  if (profile) {
    console.log(`Found Profile!`);
    console.log(`Email: ${profile.email}`);
    console.log(`Name: ${profile.full_name}`);
    console.log(`Profile.role: ${profile.role || 'N/A'}`);
    
    const personas = await prisma.userPersonas.findMany({
      where: { user_id: profile.id }
    });
    console.log(`Personas:`, personas);
  } else {
    console.log(`No profile found with phone 0701355245`);
  }
  console.log('----------------------------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
