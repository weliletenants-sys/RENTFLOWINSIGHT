import * as fs from 'fs';
const csv = require('csv-parser');
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();
const FUNDERS_DIR = path.join(__dirname, '..', '..', 'FUNDERS');

async function processCsv(filePath: string, handler: (row: any) => Promise<void>) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] Missing file: ${filePath}`);
    return;
  }

  const results: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        let successful = 0;
        let failed = 0;
        // Process in smaller batches
        const BATCH_SIZE = 50;
        for (let i = 0; i < results.length; i += BATCH_SIZE) {
          const batch = results.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map(async (row) => {
              try {
                await handler(row);
                successful++;
              } catch (e: any) {
                // Ignore P2002 duplicate key errors silently since we might be rerunning
                if (e.code !== 'P2002') {
                   // console.error(`Error processing row in ${path.basename(filePath)}:`, e.message);
                }
                failed++;
              }
            })
          );
        }
        console.log(`[DONE] ${path.basename(filePath)}: ${successful} imported, ${failed} skipped (duplicates/errors)`);
        resolve(true);
      })
      .on('error', reject);
  });
}

const safeNum = (val: string) => val ? Number(val) : 0;
const safeBool = (val: string) => val === 'true' || val === '1' || val === 't';
const safeDate = (val: string) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

async function main() {
  console.log('--- STARTING FUNDERS MIGRATION ---');

  // 1. Investor Portfolios
  await processCsv(
    path.join(FUNDERS_DIR, 'investor_portfolios.csv'),
    async (row) => {
      // Map back legacy 'agent_id' references if they exist
      const investigatorKey = row.investor_id || row.agent_id || 'UNKNOWN';
      if (!row.id || investigatorKey === 'UNKNOWN') return;
      
      await prisma.investorPortfolios.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          investor_id: investigatorKey,
          agent_id: investigatorKey, // Portfolios usually tie agent_id and investor_id identically in legacy
          account_name: row.account_name || 'Legacy Portfolio',
          investment_amount: safeNum(row.investment_amount),
          duration_months: safeNum(row.duration_months),
          roi_percentage: safeNum(row.roi_percentage),
          status: row.status || 'active',
          portfolio_code: row.portfolio_code || `PF-${Math.floor(Math.random() * 90000)}`,
          portfolio_pin: row.portfolio_pin || '0000',
          activation_token: row.activation_token || Math.random().toString(36).substring(7),
          created_at: safeDate(row.created_at) || new Date().toISOString(),
          // Other defaults
          total_roi_earned: safeNum(row.total_roi_earned),
          roi_mode: row.roi_mode || 'monthly_payout',
        }
      });
    }
  );

  // 2. Withdrawal Requests (withdrawal_requests.csv)
  await processCsv(
    path.join(FUNDERS_DIR, 'withdrawal_requests.csv'),
    async (row) => {
      const targetUser = row.user_id || row.agent_id;
      if (!row.id || !targetUser) return;
      
      await prisma.investmentWithdrawalRequests.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          user_id: targetUser,
          amount: safeNum(row.amount),
          status: row.status || 'pending',
          requested_at: safeDate(row.created_at) || new Date().toISOString(),
          earliest_process_date: safeDate(row.created_at) || new Date().toISOString(),
          rewards_paused: safeBool(row.rewards_paused),
          created_at: safeDate(row.created_at) || new Date().toISOString(),
          updated_at: safeDate(row.updated_at) || new Date().toISOString(),
        }
      });
    }
  );

  // 3. Partner Escalations
  await processCsv(
    path.join(FUNDERS_DIR, 'partner_escalations.csv'),
    async (row) => {
      if (!row.id) return;
      await prisma.partnerEscalations.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          escalation_type: row.priority || 'standard',
          details: row.title || 'Legacy Support Ticket',
          portfolio_id: row.portfolio_id || null,
          status: row.status || 'open',
          created_at: safeDate(row.created_at) || new Date().toISOString(),
        }
      });
    }
  );

  console.log('--- FUNDERS MIGRATION COMPLETE ---');
}

main()
  .catch((e) => {
    console.error('Migration crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
