const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanUpDuplicatePhones() {
  console.log('Fetching all profiles...');
  const profiles = await prisma.profiles.findMany();
  
  const phoneMap = new Map();
  let updatedCount = 0;

  for (const profile of profiles) {
    if (!profile.phone || profile.phone.trim() === '') {
      const newPhone = '000-' + Math.random().toString().substring(2, 10);
      await prisma.profiles.update({
        where: { id: profile.id },
        data: { phone: newPhone }
      });
      updatedCount++;
      continue;
    }

    if (phoneMap.has(profile.phone)) {
      // Duplicate found, manipulate the phone number
      const newPhone = profile.phone + '-' + Math.random().toString().substring(2, 6);
      await prisma.profiles.update({
        where: { id: profile.id },
        data: { phone: newPhone }
      });
      updatedCount++;
    } else {
      phoneMap.set(profile.phone, true);
    }
  }

  console.log(`Deduplicated ${updatedCount} phone entries to prepare for the UNIQUE constraint.`);
}

cleanUpDuplicatePhones()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
