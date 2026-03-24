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
  if (userIdIndex === -1) {
    // try checking if 'id' or any other field maps
    console.log("Headers: ", headers);
    return;
  }

  const userIds = new Set<string>();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    const uid = parts[userIdIndex];
    if (uid && uid.length > 5) {
      userIds.add(uid);
    }
  }

  console.log(`Extracted ${userIds.size} unique user_ids from ${lines.length - 1} rows.`);

  const existingRoles = await prisma.userRoles.findMany({
    where: {
      role: 'FUNDER',
      user_id: { in: Array.from(userIds) }
    }
  });

  const funderIds = new Set(existingRoles.map(r => r.user_id).filter(id => id));

  const existingProfiles = await prisma.profiles.count({
    where: { id: { in: Array.from(userIds) } }
  });

  console.log(`Total Found in DB as Profiles: ${existingProfiles}`);
  console.log(`Total Found in DB specifically as FUNDERs: ${funderIds.size}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
