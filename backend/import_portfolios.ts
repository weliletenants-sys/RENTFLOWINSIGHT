import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = 'c:\\Users\\USER\\Documents\\RENTFLOWINSIGHT\\FUNDERS\\investor_portfolios.csv';
  const data = fs.readFileSync(filePath, 'utf-8');
  
  const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) throw new Error('Empty CSV');

  const headers = lines[0].split(';');

  const idx = (name: string) => headers.indexOf(name);

  const parseNum = (val: string | undefined): number | null => {
      if (!val) return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
  };

  const portfoliosToCreate: any[] = [];
  let importedCount = 0;
  let skippedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(';');
    const id = row[idx('id')];
    if (!id || id.length < 5) continue;

    const existing = await prisma.investorPortfolios.findFirst({ where: { id } });
    if (existing) {
        skippedCount++;
        continue;
    }

    portfoliosToCreate.push({
        id,
        account_name: row[idx('account_name')] || null,
        account_number: row[idx('account_number')] || null,
        activation_token: row[idx('activation_token')] || '',
        agent_id: row[idx('agent_id')] || null,
        bank_name: row[idx('bank_name')] || null,
        created_at: row[idx('created_at')] || new Date().toISOString(),
        duration_months: parseNum(row[idx('duration_months')]) || 12,
        investment_amount: parseNum(row[idx('investment_amount')]) || 0,
        investor_id: row[idx('investor_id')] || null,
        invite_id: row[idx('invite_id')] || null,
        maturity_date: row[idx('maturity_date')] || null,
        mobile_money_number: row[idx('mobile_money_number')] || null,
        mobile_network: row[idx('mobile_network')] || null,
        next_roi_date: row[idx('next_roi_date')] || null,
        payment_method: row[idx('payment_method')] || null,
        portfolio_code: row[idx('portfolio_code')] || '',
        portfolio_pin: row[idx('portfolio_pin')] || '',
        roi_mode: row[idx('roi_mode')] || 'monthly_payout',
        roi_percentage: parseNum(row[idx('roi_percentage')]) || 15,
        status: row[idx('status')] || 'active',
        total_roi_earned: parseNum(row[idx('total_roi_earned')]) || 0,
        payout_day: parseNum(row[idx('payout_day')]) || null,
    });
  }

  if (portfoliosToCreate.length > 0) {
      await prisma.investorPortfolios.createMany({
          data: portfoliosToCreate,
          skipDuplicates: true
      });
      importedCount = portfoliosToCreate.length;
  }

  console.log(`Successfully imported ${importedCount} actual portfolios into the database. Skipped ${skippedCount} already existing ones.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
