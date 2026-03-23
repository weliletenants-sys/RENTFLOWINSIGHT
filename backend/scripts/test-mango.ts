import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMango() {
  const profile = await prisma.profiles.findFirst({
    where: { email: 'mango@gmail.com' },
  });
  
  console.log('--- MANGO PROFILE ---');
  console.log(profile);

  if (profile) {
    // Attempt the exact update to see if Prisma complains
    try {
      console.log('\n--- ATTEMPTING PRISMA UPDATE ---');
      const testUpdate = await prisma.profiles.update({
        where: { id: profile.id },
        data: {
          // @ts-ignore
          kyc_status: 'UNDER_REVIEW'
        }
      });
      console.log('Update SUCCEEDED:', testUpdate);
      
      // Revert it
      await prisma.$executeRawUnsafe(`UPDATE profiles SET kyc_status = 'NOT_SUBMITTED' WHERE id = '${profile.id}'`);
    } catch (e: any) {
      console.error('Update FAILED:', e.message);
    }
  }

  // Check logs
  const fs = require('fs');
  try {
    const errorLog = fs.readFileSync('./logs/error.log', 'utf8');
    console.log('\n--- ERROR LOG ---');
    console.log(errorLog.split('\n').slice(-10).join('\n'));
  } catch (e) {
    console.log('No error log yet.');
  }

  await prisma.$disconnect();
}

checkMango();
