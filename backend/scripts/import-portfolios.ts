import fs from 'fs';
import path from 'path';
import prisma from '../src/prisma/prisma.client';

async function importPortfolios() {
  const filePath = path.resolve(__dirname, '../../FUNDERS/public.investor_portfolios.csv');
  console.log(`Reading CSV from ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error('File not found!');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Header line
  // account_name;account_number;activation_token;agent_id;auto_reinvest;bank_name;created_at;display_currency;duration_months;id;investment_amount;investor_id;invite_id;maturity_alert_30d;maturity_alert_7d;maturity_date;mobile_money_number;mobile_network;next_roi_date;payment_method;payout_day;portfolio_code;portfolio_pin;roi_mode;roi_percentage;status;total_roi_earned
  const headers = lines[0].split(';');

  const portfoliosToInsert = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(';');
    if (row.length !== headers.length) continue;

    const data: any = {};
    headers.forEach((header, index) => {
      const val = row[index].trim();
      data[header] = val === '' ? null : val;
    });

    // Cleanup and parse specific columns
    const record = {
      id: data.id || undefined,
      account_name: data.account_name,
      account_number: data.account_number,
      activation_token: data.activation_token || 'import-token',
      agent_id: data.agent_id,
      auto_renew: data.auto_reinvest === 'true',
      bank_name: data.bank_name,
      created_at: data.created_at || new Date().toISOString(),
      duration_months: Number(data.duration_months) || 12,
      investment_amount: Number(data.investment_amount) || 0,
      investor_id: data.investor_id,
      invite_id: data.invite_id,
      maturity_date: data.maturity_date,
      mobile_money_number: data.mobile_money_number,
      mobile_network: data.mobile_network,
      next_roi_date: data.next_roi_date,
      payment_method: data.payment_method,
      payout_day: Number(data.payout_day) || null,
      portfolio_code: data.portfolio_code || 'WPF-0000',
      portfolio_pin: data.portfolio_pin || '0000',
      roi_mode: data.roi_mode || 'monthly_payout',
      roi_percentage: Number(data.roi_percentage) || 15,
      status: (data.status || 'active').toUpperCase(), // Normalize to uppercase
      total_roi_earned: Number(data.total_roi_earned) || 0,
    };

    portfoliosToInsert.push(record);
  }

  console.log(`Parsed ${portfoliosToInsert.length} valid portfolio records. Inserting into db...`);

  let count = 0;
  for (const port of portfoliosToInsert) {
    try {
      await prisma.investorPortfolios.upsert({
        where: { id: port.id },
        create: port,
        update: port
      });
      count++;
    } catch (e) {
      console.error(`Failed to insert portfolio ID: ${port.id}`, e);
    }
  }

  console.log(`✅ Successfully synced ${count} portfolios directly into the database.`);
}

importPortfolios()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
