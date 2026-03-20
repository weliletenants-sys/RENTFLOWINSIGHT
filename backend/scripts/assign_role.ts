import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignRole() {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.error('Error: Missing arguments.');
    console.error('Usage: npx ts-node scripts/assign_role.ts <email> <ROLE_NAME>');
    console.error('Example: npx ts-node scripts/assign_role.ts admin@example.com SUPER_ADMIN');
    console.error('Example: npx ts-node scripts/assign_role.ts coo@example.com CHIEF_OPERATING_OFFICER');
    process.exit(1);
  }

  try {
    console.log(`Searching for user with email: ${email}...`);
    
    const profile = await prisma.profiles.findFirst({
      where: { email }
    });

    if (!profile) {
      console.error(`❌ User with email ${email} not found.`);
      process.exit(1);
    }

    // Update the master profile record
    await prisma.profiles.update({
      where: { id: profile.id },
      data: { role }
    });

    // Update the UserRoles table which controls some specific authorizations
    const existingUserRole = await prisma.userRoles.findFirst({
      where: { user_id: profile.id }
    });

    if (existingUserRole) {
      await prisma.userRoles.update({
        where: { id: existingUserRole.id },
        data: { role }
      });
    } else {
      await prisma.userRoles.create({
        data: {
          user_id: profile.id,
          role: role,
          enabled: true,
          created_at: new Date().toISOString()
        }
      });
    }

    // Critical: Login controller reads from UserPersonas
    const existingPersona = await prisma.userPersonas.findFirst({
      where: { user_id: profile.id, is_default: true }
    });

    if (existingPersona) {
      await prisma.userPersonas.update({
        where: { id: existingPersona.id },
        data: { persona: role.toLowerCase() }
      });
    } else {
      await prisma.userPersonas.create({
        data: {
          user_id: profile.id,
          persona: role.toLowerCase(),
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    console.log(`✅ Successfully assigned role '${role}' to user ${email} (ID: ${profile.id})`);
  } catch (error) {
    console.error('❌ Failed to assign role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignRole();
