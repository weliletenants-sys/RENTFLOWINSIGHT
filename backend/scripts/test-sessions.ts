import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profiles.findFirst({
    where: { email: 'pexpert@gmail.com' }
  });

  if (!profile) {
    console.log('Profile not found.');
    return;
  }

  const sessions = await prisma.sessions.findMany({
    where: { user_id: profile.id }
  });
  
  console.log(`Found ${sessions.length} total sessions for Pius.`);
  sessions.forEach(s => {
    console.log(`Token: ${s.token.substring(0, 10)}... | Revoked: ${s.is_revoked} | Expires: ${s.expires_at}`);
  });
}

main().finally(() => prisma.$disconnect());
