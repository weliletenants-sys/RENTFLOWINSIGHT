import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateAIID(identifier: string): string {
  // Matches the frontend algorithm
  const hash = Array.from(identifier).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  return `WEL-${hex}`;
}

async function main() {
  console.log('Fetching all profiles...');
  const profiles = await prisma.profiles.findMany({
    select: { id: true, email: true, ai_id: true }
  });

  console.log(`Found ${profiles.length} profiles to process.`);

  let updated = 0;
  for (const profile of profiles) {
    if (!profile.ai_id) {
      const identifier = profile.id || profile.email || "fallback";
      const generatedId = generateAIID(identifier);
      try {
        // Fallback for duplicates inside same hex cluster
        // For production, a more resilient unqiue constraint catch is needed, but this works to start.
        await prisma.profiles.update({
          where: { id: profile.id },
          data: { ai_id: generatedId }
        });
        updated++;
        if (updated % 100 === 0) console.log(`Processed ${updated} profiles...`);
      } catch (err) {
        console.error(`Failed to update profile ${profile.id}:`, err);
      }
    }
  }

  console.log(`Successfully backfilled ${updated} profiles with AI IDs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
