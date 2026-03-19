
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const FUNDERS_DIR = path.join(__dirname, '../FUNDERS');

async function main() {
  console.log('Starting Funder Account Creation and Binding to AWS...');

  // 1. Read SUMMARY.csv
  const summaryCsvPath = path.join(FUNDERS_DIR, 'SUMMARY.csv');
  if (!fs.existsSync(summaryCsvPath)) {
    console.error('SUMMARY.csv not found!');
    process.exit(1);
  }

  const summaryCsv = fs.readFileSync(summaryCsvPath, 'utf8');
  // First column is empty string header, but standard otherwise. Delimiter is ';'
  const records: any[] = parse(summaryCsv, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';'
  });

  console.log(`Read ${records.length} funder records. Beginning identity sync...`);

  // Secure temporary password
  const TEMP_PASSWORD = 'Welile2026!';
  const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 10);
  let syncedProfiles = 0;
  let syncedPortfolios = 0;

  for (const record of records) {
    const email = record.email?.trim();
    if (!email) continue;

    const fullName = record.full_name?.trim() || 'Funder User';
    const phone = record.phone?.trim() || '';
    const portfolioCode = record.portfolio_code?.trim();

    try {
      // Step A: Upsert Profile
      let profile = await prisma.profiles.findFirst({ where: { email } });

      if (!profile) {
        profile = await prisma.profiles.create({
          data: {
            email,
            full_name: fullName,
            phone,
            password_hash: hashedPassword,
            verified: true,
            is_frozen: false,
            rent_discount_active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
        syncedProfiles++;
      }

      // Step B: Ensure generic UserRoles is set correctly
      const existingRole = await prisma.userRoles.findFirst({
        where: { user_id: profile.id, role: 'FUNDER' }
      });

      if (!existingRole) {
        await prisma.userRoles.create({
          data: {
            id: `${profile.id}-FUNDER`,
            user_id: profile.id,
            role: 'FUNDER',
            enabled: true,
            created_at: new Date().toISOString()
          }
        });
      }

      // Step C: Ensure Wallet exists
      const existingWallet = await prisma.wallets.findFirst({ where: { user_id: profile.id } });
      if (!existingWallet) {
        await prisma.wallets.create({
          data: {
            user_id: profile.id,
            balance: 0, // Assuming capital is fully locked in portfolios initially
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }

      // Step D: Re-bind Portfolio Foreign Keys
      if (portfolioCode) {
        const updateResult = await prisma.investorPortfolios.updateMany({
          where: { portfolio_code: portfolioCode },
          data: { investor_id: profile.id }
        });

        if (updateResult.count > 0) {
          syncedPortfolios += updateResult.count;
        }
      }

    } catch (err: any) {
      console.error(`Error processing Funder ${email}:`, err.message);
    }
  }

  console.log('✅ AWS Funder Profile Auth Binding Complete!');
  console.log(`   - New Profiles Created: ${syncedProfiles}`);
  console.log(`   - Portfolios Successfully Bound: ${syncedPortfolios}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
