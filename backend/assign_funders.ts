import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = 'c:\\Users\\USER\\Documents\\RENTFLOWINSIGHT\\FUNDERS\\PORTIFOLIOS.csv';
  const data = fs.readFileSync(filePath, 'utf-8');
  
  const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    throw new Error('Empty CSV');
  }

  const headers = lines[0].split(';');
  const userIdIndex = headers.indexOf('user_id');

  const userIds = new Set<string>();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    const uid = parts[userIdIndex];
    if (uid && uid.length > 5) {
      userIds.add(uid);
    }
  }

  console.log(`Processing ${userIds.size} unique user_ids...`);

  const existingProfiles = await prisma.profiles.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true }
  });

  const validUserIds = existingProfiles.map(p => p.id);
  console.log(`Found ${validUserIds.length} valid profiles in the database out of ${userIds.size}.`);

  let newRolesAdded = 0;
  for (const uid of validUserIds) {
    const existing = await prisma.userRoles.findFirst({
      where: { user_id: uid, role: 'FUNDER' }
    });

    if (!existing) {
      await prisma.userRoles.create({
        data: {
          user_id: uid,
          role: 'FUNDER',
          enabled: true,
          created_at: new Date().toISOString()
        }
      });
      newRolesAdded++;
    } else if (!existing.enabled) {
      await prisma.userRoles.update({
        where: { id: existing.id },
        data: { enabled: true }
      });
      newRolesAdded++;
    }
  }

  console.log(`Successfully added/enabled the FUNDER role for ${newRolesAdded} users.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
