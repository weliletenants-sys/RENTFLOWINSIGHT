import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = 'c:\\Users\\USER\\Documents\\RENTFLOWINSIGHT\\FUNDERS\\partner-import-template.xlsx';
  
  console.log(`Reading Excel file: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const rows = xlsx.utils.sheet_to_json(worksheet) as any[];
  
  console.log(`Loaded ${rows.length} rows from Excel.`);
  if (rows.length > 0) {
    console.log(`Sample row columns:`, Object.keys(rows[0]));
  }
  
  const existingProfiles = await prisma.profiles.findMany({
    select: { phone: true, email: true }
  });

  const existingPhones = new Set(existingProfiles.map(p => p.phone?.trim()).filter(Boolean));
  const existingEmails = new Set(existingProfiles.map(p => p.email?.trim().toLowerCase()).filter(Boolean));

  const missing = [];

  for (const row of rows) {
    const keys = Object.keys(row);
    const phoneKey = keys.find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('contact') || k.toLowerCase().includes('mobile'));
    const emailKey = keys.find(k => k.toLowerCase().includes('email'));
    const nameKey = keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('investor'));

    const rawPhone = phoneKey ? String(row[phoneKey]).trim() : '';
    const rawEmail = emailKey ? String(row[emailKey]).trim().toLowerCase() : '';
    const name = nameKey ? String(row[nameKey]) : 'Unknown';

    if (!rawPhone && !rawEmail) {
      continue;
    }

    let isMissing = true;
    
    // Check if phone matches any format inside the DB (e.g. +256 vs 07)
    if (rawPhone) {
      const sanitizedPhone = rawPhone.replace(/\D/g, ''); // strip to numbers only
      for (const ep of existingPhones) {
         if (ep?.replace(/\D/g, '') === sanitizedPhone || ep === rawPhone || rawPhone.includes(ep) || ep.includes(rawPhone)) {
             isMissing = false;
             break;
         }
      }
    }
    
    if (rawEmail && existingEmails.has(rawEmail)) {
      isMissing = false;
    }

    if (isMissing) {
      missing.push({ name, email: rawEmail, phone: rawPhone });
    }
  }

  console.log(`\n============================`);
  console.log(`Found ${missing.length} missing partners/funders:`);
  console.log(`============================`);
  console.table(missing);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
