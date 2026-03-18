import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();
const FUNDERS_DIR = path.join(__dirname, '../FUNDERS');

async function main() {
  console.log('Starting Funder Data Migration to AWS...');

  // 1. investment_withdrawal_requests
  const withdrawalsCsv = fs.readFileSync(path.join(FUNDERS_DIR, 'public.investment_withdrawal_requests.csv'), 'utf8');
  const withdrawalsRecords = parse(withdrawalsCsv, { columns: true, skip_empty_lines: true, delimiter: ';' });
  
  console.log(`Read ${withdrawalsRecords.length} withdrawal requests. Syncing...`);
  for (const record of withdrawalsRecords) {
    await prisma.investmentWithdrawalRequests.upsert({
      where: { id: record.id },
      update: {
        amount: parseFloat(record.amount) || 0,
        status: record.status,
        reason: record.reason || null,
        rejection_reason: record.rejection_reason || null,
        processed_by: record.processed_by || null,
        processed_at: record.processed_at || null,
        earliest_process_date: record.earliest_process_date,
        updated_at: record.updated_at,
        rewards_paused: record.rewards_paused === 'true' || record.rewards_paused === 't',
      },
      create: {
        id: record.id,
        amount: parseFloat(record.amount) || 0,
        created_at: record.created_at,
        requested_at: record.requested_at,
        earliest_process_date: record.earliest_process_date,
        status: record.status,
        reason: record.reason || null,
        rejection_reason: record.rejection_reason || null,
        processed_by: record.processed_by || null,
        processed_at: record.processed_at || null,
        updated_at: record.updated_at,
        rewards_paused: record.rewards_paused === 'true' || record.rewards_paused === 't',
      }
    });
  }

  // 2. investor_portfolios
  const portfoliosCsv = fs.readFileSync(path.join(FUNDERS_DIR, 'public.investor_portfolios.csv'), 'utf8');
  const portfoliosRecords = parse(portfoliosCsv, { columns: true, skip_empty_lines: true, delimiter: ';' });
  
  console.log(`Read ${portfoliosRecords.length} portfolios. Syncing...`);
  for (const record of portfoliosRecords) {
    if (!record.id) continue;
    await prisma.investorPortfolios.upsert({
      where: { id: record.id },
      update: {
        status: record.status,
        roi_mode: record.roi_mode,
        roi_percentage: parseFloat(record.roi_percentage) || 0,
        total_roi_earned: parseFloat(record.total_roi_earned) || 0,
        next_roi_date: record.next_roi_date || null,
      },
      create: {
        id: record.id,
        investor_id: record.investor_id || null,
        agent_id: record.agent_id || null,
        invite_id: record.invite_id || null,
        account_name: record.account_name || null,
        account_number: record.account_number || null,
        bank_name: record.bank_name || null,
        payment_method: record.payment_method || null,
        mobile_money_number: record.mobile_money_number || null,
        mobile_network: record.mobile_network || null,
        portfolio_code: record.portfolio_code,
        portfolio_pin: record.portfolio_pin || '0000',
        investment_amount: parseFloat(record.investment_amount) || 0,
        roi_mode: record.roi_mode,
        roi_percentage: parseFloat(record.roi_percentage) || 0,
        total_roi_earned: parseFloat(record.total_roi_earned) || 0,
        duration_months: parseFloat(record.duration_months) || 12,
        maturity_date: record.maturity_date || null,
        next_roi_date: record.next_roi_date || null,
        activation_token: record.activation_token || '',
        status: record.status,
        created_at: record.created_at,
      }
    });
  }

  // 3. partner_escalations
  const escalationsCsv = fs.readFileSync(path.join(FUNDERS_DIR, 'public.partner_escalations.csv'), 'utf8');
  const escalationsRecords = parse(escalationsCsv, { columns: true, skip_empty_lines: true, delimiter: ';' });
  
  console.log(`Read ${escalationsRecords.length} partner escalations. Syncing...`);
  for (const record of escalationsRecords) {
    if (!record.id) continue;
    await prisma.partnerEscalations.upsert({
      where: { id: record.id },
      update: {
        status: record.status,
        details: record.details || null,
        resolved_at: record.resolved_at || null,
        resolved_by: record.resolved_by || null,
      },
      create: {
        id: record.id,
        portfolio_id: record.portfolio_id || null,
        escalation_type: record.escalation_type,
        details: record.details || null,
        status: record.status,
        created_at: record.created_at,
        resolved_at: record.resolved_at || null,
        resolved_by: record.resolved_by || null,
      }
    });
  }

  // 4. supporter_invites
  const invitesCsv = fs.readFileSync(path.join(FUNDERS_DIR, 'public.supporter_invites.csv'), 'utf8');
  const invitesRecords = parse(invitesCsv, { columns: true, skip_empty_lines: true, delimiter: ';' });
  
  console.log(`Read ${invitesRecords.length} supporter invites. Syncing...`);
  let inviteCount = 0;
  for (const record of invitesRecords) {
    if (!record.id) continue;
    await prisma.supporterInvites.upsert({
      where: { id: record.id },
      update: {
        status: record.status,
        activated_at: record.activated_at || null,
        activated_user_id: record.activated_user_id || null,
      },
      create: {
        id: record.id,
        email: record.email,
        phone: record.phone,
        full_name: record.full_name,
        role: record.role,
        status: record.status,
        created_by: record.created_by,
        created_at: record.created_at,
        activation_token: record.activation_token,
        activated_at: record.activated_at || null,
        activated_user_id: record.activated_user_id || null,
        temp_password: record.temp_password || null,
        national_id: record.national_id || null,
        account_name: record.account_name || null,
        account_number: record.account_number || null,
        bank_name: record.bank_name || null,
        mobile_money_number: record.mobile_money_number || null,
        mobile_network: record.mobile_network || null,
        payment_method: record.payment_method || null,
        country: record.country || null,
        district_city: record.district_city || null,
        property_address: record.property_address || null,
        latitude: parseFloat(record.latitude) || null,
        longitude: parseFloat(record.longitude) || null,
        location_accuracy: parseFloat(record.location_accuracy) || null,
        parent_agent_id: record.parent_agent_id || null,
        next_of_kin_name: record.next_of_kin_name || null,
        next_of_kin_phone: record.next_of_kin_phone || null,
        next_of_kin_relationship: record.next_of_kin_relationship || null,
      }
    });
    inviteCount++;
    if (inviteCount % 100 === 0) console.log(`  -> Synced ${inviteCount} / ${invitesRecords.length} invites...`);
  }

  // 5. supporter_roi_payments
  const roiCsv = fs.readFileSync(path.join(FUNDERS_DIR, 'public.supporter_roi_payments.csv'), 'utf8');
  const roiRecords = parse(roiCsv, { columns: true, skip_empty_lines: true, delimiter: ';' });
  
  console.log(`Read ${roiRecords.length} ROI payments. Syncing...`);
  for (const record of roiRecords) {
    if (!record.id) continue;
    await prisma.supporterRoiPayments.upsert({
      where: { id: record.id },
      update: {
        status: record.status,
        paid_at: record.paid_at || null,
      },
      create: {
        id: record.id,
        rent_request_id: record.rent_request_id || null,
        payment_number: parseFloat(record.payment_number) || 0,
        rent_amount: parseFloat(record.rent_amount) || 0,
        roi_amount: parseFloat(record.roi_amount) || 0,
        status: record.status,
        due_date: record.due_date,
        paid_at: record.paid_at || null,
        created_at: record.created_at,
      }
    });
  }

  console.log('✅ AWS DB Funder Sync Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
