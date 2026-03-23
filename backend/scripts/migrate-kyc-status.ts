/**
 * Add KYC columns to profiles table
 * Run with: npx ts-node --skip-project scripts/migrate-kyc-status.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n[ KYC Migration ] Adding kyc_status columns to profiles table...\n');

  // Add each column if it doesn't already exist (safe to re-run)
  const migrations = [
    {
      name: 'kyc_status',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT NOT NULL DEFAULT 'NOT_SUBMITTED';`,
    },
    {
      name: 'kyc_submitted_at',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_submitted_at TEXT;`,
    },
    {
      name: 'kyc_approved_at',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_approved_at TEXT;`,
    },
    {
      name: 'kyc_rejected_reason',
      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_rejected_reason TEXT;`,
    },
  ];

  for (const m of migrations) {
    try {
      await prisma.$executeRawUnsafe(m.sql);
      console.log(`  ✓ ${m.name}`);
    } catch (err: any) {
      console.error(`  ✗ ${m.name}: ${err.message}`);
    }
  }

  // Verify
  const result: any[] = await prisma.$queryRaw`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'profiles'
      AND column_name IN ('kyc_status', 'kyc_submitted_at', 'kyc_approved_at', 'kyc_rejected_reason')
    ORDER BY column_name;
  `;

  console.log(`\n  Verification — ${result.length}/4 KYC columns present in DB:`);
  result.forEach(r =>
    console.log(`    · ${r.column_name} (${r.data_type}) default="${r.column_default}"`)
  );

  if (result.length === 4) {
    console.log('\n  ✓ Migration complete — all KYC columns are in the database.\n');
  } else {
    console.warn(`\n  ⚠ Only ${result.length}/4 columns found — check errors above.\n`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Migration failed:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
