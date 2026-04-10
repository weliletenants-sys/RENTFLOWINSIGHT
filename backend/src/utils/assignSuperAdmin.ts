import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@welile.com';
  const roleName = 'SUPER_ADMIN';

  console.log(`Looking for user with email ${email}...`);
  let profile = await prisma.profiles.findFirst({
    where: { email },
  });

  if (!profile) {
    console.log(`User not found. Creating ${email} with password 'admin'...`);
    const password_hash = await bcrypt.hash('admin', 10);
    
    profile = await prisma.profiles.create({
      data: {
        email,
        phone: '1110000000',
        full_name: 'Super Admin',
        verified: true,
        password_hash,
        role: roleName,
        is_frozen: false,
        rent_discount_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } else {
    console.log(`Found user ${profile.id}. Updating role...`);
    await prisma.profiles.update({
      where: { id: profile.id },
      data: { role: roleName },
    });
  }

  // Assign via UserRoles mapping table
  const existingRole = await prisma.userRoles.findFirst({
      where: { user_id: profile.id, role: roleName }
  });

  if (!existingRole) {
      await prisma.userRoles.create({
        data: {
            user_id: profile.id,
            role: roleName,
            enabled: true,
            created_at: new Date().toISOString()
        }
      });
  }

  console.log(`Successfully assigned ${roleName} to ${email}! Password is 'admin'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
