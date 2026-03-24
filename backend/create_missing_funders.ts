import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = 'c:\\Users\\USER\\Documents\\RENTFLOWINSIGHT\\FUNDERS\\investor_portfolios.csv';
  const data = fs.readFileSync(filePath, 'utf-8');
  
  const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) throw new Error('Empty CSV');

  const headers = lines[0].split(';');
  const investorIdIdx = headers.indexOf('investor_id');
  const accountNameIdx = headers.indexOf('account_name');
  const phoneIdx = headers.indexOf('mobile_money_number');

  if (investorIdIdx === -1) throw new Error('Missing investor_id');

  const missingUsers = new Map<string, {name: string, phone: string}>();

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    const uid = parts[investorIdIdx];
    if (uid && uid.length > 5) {
      if (!missingUsers.has(uid)) {
        missingUsers.set(uid, {
          name: accountNameIdx !== -1 ? parts[accountNameIdx] : '',
          phone: phoneIdx !== -1 ? parts[phoneIdx] : ''
        });
      }
    }
  }

  const existingProfiles = await prisma.profiles.findMany({
    where: { id: { in: Array.from(missingUsers.keys()) } },
    select: { id: true, phone: true }
  });

  const existingIds = new Set(existingProfiles.map(p => p.id));
  
  const allExistingPhones = await prisma.profiles.findMany({
    select: { phone: true }
  });
  const existingPhones = new Set(allExistingPhones.map(p => p.phone).filter(p => !!p));

  let createdCount = 0;
  const now = new Date().toISOString();

  for (const [uid, data] of missingUsers.entries()) {
    if (!existingIds.has(uid)) {
      const email = `funder-${uid.substring(0, 8)}@rentflowmock.com`;
      
      let phoneStr = data.phone;
      if (!phoneStr || existingPhones.has(phoneStr)) {
          // generate a dummy phone number if it conflicts or doesn't exist
          phoneStr = `00000000${uid.substring(0,6)}`;
      }

      await prisma.profiles.create({
        data: {
          id: uid,
          email: email,
          full_name: data.name || 'Funder User',
          phone: phoneStr,
          is_frozen: false,
          created_at: now,
          updated_at: now,
          verified: true,
          rent_discount_active: false
        }
      });

      if (phoneStr) {
          existingPhones.add(phoneStr);
      }

      await prisma.userRoles.create({
        data: {
          user_id: uid,
          role: 'FUNDER',
          enabled: true,
          created_at: now
        }
      });

      createdCount++;
    }
  }

  console.log(`Successfully created ${createdCount} missing profiles and assigned them the FUNDER role.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
