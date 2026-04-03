/**
 * Database Connection Test Script
 * Run with: npx ts-node scripts/test-db-connection.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as dns from 'dns';
import * as net from 'net';

const prisma = new PrismaClient({
  log: ['error'],
});

const DB_HOST = 'localhost';
const DB_PORT = 5433;

async function checkDns(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n[1] DNS Lookup → ${DB_HOST}`);
    dns.lookup(DB_HOST, (err, address) => {
      if (err) {
        console.error(`    ✗ DNS failed: ${err.message}`);
        reject(err);
      } else {
        console.log(`    ✓ Resolved to: ${address}`);
        resolve();
      }
    });
  });
}

async function checkTcp(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n[2] TCP Connectivity → ${DB_HOST}:${DB_PORT}`);
    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);
    socket.connect(DB_PORT, DB_HOST, () => {
      console.log(`    ✓ TCP connection established`);
      socket.destroy();
      resolve();
    });

    socket.on('timeout', () => {
      console.error(`    ✗ TCP timeout after ${timeout}ms — port may be blocked by firewall/VPN`);
      socket.destroy();
      reject(new Error('TCP timeout'));
    });

    socket.on('error', (err) => {
      console.error(`    ✗ TCP error: ${err.message}`);
      socket.destroy();
      reject(err);
    });
  });
}

async function checkPrisma(): Promise<void> {
  console.log(`\n[3] Prisma Query → SELECT 1`);
  const result = await prisma.$queryRaw`SELECT 1 AS alive`;
  console.log(`    ✓ Query succeeded:`, result);
}

async function checkKycColumns(): Promise<void> {
  console.log(`\n[4] KYC Column Check → profiles table`);
  const result: any[] = await prisma.$queryRaw`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'profiles'
      AND column_name IN ('kyc_status', 'kyc_submitted_at', 'kyc_approved_at', 'kyc_rejected_reason')
    ORDER BY column_name;
  `;
  if (result.length === 0) {
    console.warn(`    ⚠ KYC columns not yet migrated — run: npx prisma db push`);
  } else {
    console.log(`    ✓ KYC columns present (${result.length}/4):`);
    result.forEach(r => console.log(`      · ${r.column_name} (${r.data_type}) default="${r.column_default}"`));
    if (result.length < 4) {
      console.warn(`    ⚠ Only ${result.length} of 4 expected KYC columns found`);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  RentFlowInsight — DB Connection Test');
  console.log('═══════════════════════════════════════════');

  let passed = 0;
  const steps = [
    { name: 'DNS', fn: checkDns },
    { name: 'TCP', fn: checkTcp },
    { name: 'Prisma', fn: checkPrisma },
    { name: 'KYC Columns', fn: checkKycColumns },
  ];

  for (const step of steps) {
    try {
      await step.fn();
      passed++;
    } catch {
      console.log(`    → Skipping remaining DB steps due to connection failure.`);
      break;
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log(`  Result: ${passed}/${steps.length} checks passed`);
  if (passed < 2) {
    console.log('  ⚠ Cannot reach the database. Possible causes:');
    console.log('    · VPN not connected (AWS RDS is in a private subnet)');
    console.log('    · Security group does not allow your IP on port 5432');
    console.log('    · AWS RDS instance is stopped');
  } else if (passed < 4) {
    console.log('  ⚠ DB reachable but migrations may not be applied.');
    console.log('    Run: npx prisma db push');
  } else {
    console.log('  ✓ All checks passed — database is healthy.');
  }
  console.log('═══════════════════════════════════════════\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('\nFatal error:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
