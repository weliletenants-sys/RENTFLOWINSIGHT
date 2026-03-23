const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Search profiles for 'Mango'
  const profiles = await prisma.profiles.findMany({
    where: {
      full_name: { contains: 'Mango', mode: 'insensitive' }
    },
    select: { id: true, full_name: true, email: true, phone: true, role: true }
  });
  console.log('=== Profiles found ===');
  console.log(JSON.stringify(profiles, null, 2));

  if (profiles.length > 0) {
    for (const profile of profiles) {
      // Check notifications for KYC_SUBMITTED
      const kycNotif = await prisma.notifications.findMany({
        where: { user_id: profile.id, type: 'KYC_SUBMITTED' },
        orderBy: { created_at: 'desc' }
      });
      console.log(`\n=== KYC notifications for ${profile.full_name} ===`);
      console.log(JSON.stringify(kycNotif, null, 2));

      // Check supporter invites (funder KYC)
      const invite = await prisma.supporterInvites.findFirst({
        where: { email: profile.email }
      });
      console.log(`\n=== SupporterInvite for ${profile.full_name} ===`);
      console.log(JSON.stringify(invite, null, 2));
    }
  }

  // Also search supporter_invites by name directly
  const invitesByName = await prisma.supporterInvites.findMany({
    where: { full_name: { contains: 'Mango', mode: 'insensitive' } }
  });
  console.log('\n=== SupporterInvites by name ===');
  console.log(JSON.stringify(invitesByName, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
