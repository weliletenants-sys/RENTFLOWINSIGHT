import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function analyze() {
  console.log('Analyzing duplicates...');
  
  // Find all reference_ids that appear more than once
  const duplicates: any[] = await prisma.$queryRaw`
    SELECT reference_id, COUNT(*) as count 
    FROM general_ledger 
    WHERE reference_id IS NOT NULL 
    GROUP BY reference_id 
    HAVING COUNT(*) > 1;
  `;

  console.log(`Found ${duplicates.length} unique reference_ids with duplicates.`);
  
  const report: string[] = ['# Duplicate Analysis Report\n'];
  let caseBCount = 0;
  let caseACount = 0;

  for (const dup of duplicates) {
    const refId = dup.reference_id;
    const records = await prisma.generalLedger.findMany({
      where: { reference_id: refId },
      orderBy: { created_at: 'asc' }
    });

    // Check if lengths match expected. But really, check if all records are structurally identical (Case A) or diverge (Case B)
    // We expect double-entry to have pairs. So a reference_id should normally have exactly 2 records (1 cash_in, 1 cash_out).
    // Wait, the duplicate query counts `having count(*) > 1`. In a double entry system, 1 transaction creates 2 ledger entries sharing the same reference ID!
    // Ah!! A single transaction creates a debit and a credit. If both share the SAME reference_id, COUNT(*) will naturally be 2!
    
    // Let's analyze the exact nature of the records.
    let isCaseA = true;
    
    // Group records by direction
    const cashIns = records.filter(r => r.direction === 'cash_in');
    const cashOuts = records.filter(r => r.direction === 'cash_out');

    // If it's just 1 cash in and 1 cash out, and amounts match, this is NOT a duplicate, it is a VALID double entry!
    const isValidDoubleEntry = cashIns.length === 1 && cashOuts.length === 1 && cashIns[0].amount === cashOuts[0].amount;

    if (isValidDoubleEntry) {
      report.push(`✅ ${refId} is a valid double-entry pair (1 IN, 1 OUT). Not a duplicate.`);
      continue;
    }

    report.push(`### Analysis for reference_id: \`${refId}\` (Count: ${records.length})`);
    
    // Format records for output
    records.forEach((r, i) => {
      report.push(`- Record ${i+1}: ID: ${r.id} | Amount: ${r.amount} | Dir: ${r.direction} | Cat: ${r.category}`);
    });

    // Determine Case A vs Case B logic
    // ... we don't need complex logic, we just dump it for me to analyze
    report.push(`\n`);
    caseBCount++;
  }

  report.push(`\nTotal Valid Double-Entries: ${duplicates.length - caseBCount}`);
  report.push(`Total Problematic Groups: ${caseBCount}`);

  fs.writeFileSync('../artifact/duplicate_analysis.md', report.join('\n'));
  console.log('Analysis written to artifact/duplicate_analysis.md');
}

analyze()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
