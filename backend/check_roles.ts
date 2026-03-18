import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const funderProfiles = await prisma.profiles.count({ where: { role: 'FUNDER' } });
  console.log('Profiles with role FUNDER:', funderProfiles);
  
  const anyRoleCount = await prisma.profiles.count({ where: { role: { not: null } } }); 
  console.log('Profiles with ANY role set:', anyRoleCount);
  
  const sample = await prisma.profiles.findFirst({
    where: { role: 'FUNDER' },
    select: { email: true, role: true, id: true }
  });
  console.log('Sample Funder:', sample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
