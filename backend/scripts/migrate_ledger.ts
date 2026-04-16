import prisma from '../src/prisma/prisma.client';
import { v4 as uuidv4 } from 'uuid';

// -------------------------------------------------------------
// STRICT ACCOUNT TAXONOMY (The Cure for Account Explosion)
// -------------------------------------------------------------
const MASTER_ACCOUNTS = {
    // Assets
    ASSET_CASH_HOLDINGS: { id: 'ASSET_CASH_HOLDINGS', type: 'ASSET', currency: 'UGX' },
    ASSET_RENT_RECEIVABLE: { id: 'ASSET_RENT_RECEIVABLE', type: 'ASSET', currency: 'UGX' },
    
    // Liabilities
    LIAB_ROI_PAYABLE: { id: 'LIAB_ROI_PAYABLE', type: 'LIABILITY', currency: 'UGX' },
    LIAB_AGENT_PAYABLE: { id: 'LIAB_AGENT_PAYABLE', type: 'LIABILITY', currency: 'UGX' },
    LIAB_WALLET_WITHDRAWALS: { id: 'LIAB_WALLET_WITHDRAWALS', type: 'LIABILITY', currency: 'UGX' },

    // Revenue
    REV_ACCESS_FEES: { id: 'REV_ACCESS_FEES', type: 'REVENUE', currency: 'UGX' },
    REV_REGISTRATION_FEES: { id: 'REV_REGISTRATION_FEES', type: 'REVENUE', currency: 'UGX' },
    REV_MARKETPLACE: { id: 'REV_MARKETPLACE', type: 'REVENUE', currency: 'UGX' },
    REV_PENALTIES: { id: 'REV_PENALTIES', type: 'REVENUE', currency: 'UGX' },

    // Expenses
    EXP_COMMISSIONS: { id: 'EXP_COMMISSIONS', type: 'EXPENSE', currency: 'UGX' },
    EXP_OPERATIONAL: { id: 'EXP_OPERATIONAL', type: 'EXPENSE', currency: 'UGX' },
    EXP_ROI_PAYOUTS: { id: 'EXP_ROI_PAYOUTS', type: 'EXPENSE', currency: 'UGX' },

    // Equity / System
    EQUITY_PARTNER: { id: 'EQUITY_PARTNER', type: 'EQUITY', currency: 'UGX' },
    SUSPENSE: { id: 'SUSPENSE', type: 'SUSPENSE', currency: 'UGX' }, // Must be 0 at end of migration
};

function mapCategoryToMasterAccount(category: string, scope?: string): string {
    const c = (category || '').toLowerCase();
    
    // Revenue
    if (c.includes('access_fee')) return MASTER_ACCOUNTS.REV_ACCESS_FEES.id;
    if (c.includes('registration_fee')) return MASTER_ACCOUNTS.REV_REGISTRATION_FEES.id;
    if (c.includes('service_fee') || c.includes('marketplace')) return MASTER_ACCOUNTS.REV_MARKETPLACE.id;
    if (c.includes('penalty')) return MASTER_ACCOUNTS.REV_PENALTIES.id;
    
    // Assets
    if (c.includes('tenant_repayment') || c.includes('partner_funding') || c.includes('wallet_deposit') || c.includes('external_funding')) return MASTER_ACCOUNTS.ASSET_CASH_HOLDINGS.id;
    if (c.includes('rent_principal') || c.includes('rent_payment')) return MASTER_ACCOUNTS.ASSET_RENT_RECEIVABLE.id;

    // Liabilities
    if (c.includes('roi_payable') || c.includes('roi_accrued')) return MASTER_ACCOUNTS.LIAB_ROI_PAYABLE.id;
    if (c.includes('agent_payable')) return MASTER_ACCOUNTS.LIAB_AGENT_PAYABLE.id;
    if (c.includes('withdrawal')) return MASTER_ACCOUNTS.LIAB_WALLET_WITHDRAWALS.id;

    // Expenses
    if (c.includes('agent_commission')) return MASTER_ACCOUNTS.EXP_COMMISSIONS.id;
    if (c.includes('roi_payout')) return MASTER_ACCOUNTS.EXP_ROI_PAYOUTS.id;
    if (c.includes('operational') || c.includes('platform_expense')) return MASTER_ACCOUNTS.EXP_OPERATIONAL.id;

    // Equity / Safe fallback
    return MASTER_ACCOUNTS.ASSET_CASH_HOLDINGS.id; 
}


async function runProductionMigration() {
    console.log('🚀 INITIATING PRODUCTION LEDGER MIGRATION (1M+ SCALE V2) 🚀\n');

    console.log('1. Wiping existing V2 financial structures for clean slate...');
    await prisma.financialEntries.deleteMany();
    await prisma.financialTransactions.deleteMany();
    await prisma.financialAccounts.deleteMany();
    
    console.log('2. Provisioning Master Accounts...');
    const masterData = Object.values(MASTER_ACCOUNTS).map(acc => ({
       id: acc.id,
       type: acc.type,
       currency: acc.currency,
       balance: 0,
       created_at: new Date()
    }));
    await prisma.financialAccounts.createMany({ data: masterData });

    console.log('3. Provisioning Physical Wallets...');
    const wallets = await prisma.wallets.findMany();
    const walletMap: Record<string, string> = {};
    for (const w of wallets) {
        await prisma.financialAccounts.create({
            data: { id: w.id, user_id: w.user_id, type: 'WALLET', currency: w.currency || 'UGX' }
        });
        walletMap[`USER_${w.user_id}`] = w.id;
        walletMap[`ID_${w.id}`] = w.id;
    }

    console.log('\n4. Streaming Legacy Ledger into True Double-Entry...');

    const BATCH_SIZE = 5000;
    let processedGroups = 0;
    let lastSeenId = '';
    
    let globalDebits = 0;
    let globalCredits = 0;
    
    // Phase 1: Determine total transaction groups to stream safely
    const groupCountRaw: any = await prisma.$queryRaw`
         SELECT COUNT(DISTINCT transaction_id) as total, COUNT(DISTINCT transaction_group_id) as total2 
         FROM general_ledger`;
    
    // Depending on what was used in the schema. (Using transaction_id if distinct groups were mapped there)
    const totalTransactions = Number(groupCountRaw[0].total) > Number(groupCountRaw[0].total2) ? Number(groupCountRaw[0].total) : Number(groupCountRaw[0].total2);
    
    console.log(`📡 Discovered ~${totalTransactions} unique transactional events to process.\n`);

    while (true) {
        // Fetch DISTINCT transaction IDs safely in constant O(1) cursor pagination
        const distinctTxs: { tx_id: string }[] = await prisma.$queryRaw`
           SELECT DISTINCT COALESCE(transaction_group_id, transaction_id, id) as tx_id 
           FROM general_ledger 
           WHERE COALESCE(transaction_group_id, transaction_id, id) > ${lastSeenId}
           ORDER BY tx_id ASC
           LIMIT ${BATCH_SIZE}
        `;

        if (distinctTxs.length === 0) break;

        const txIds = distinctTxs.map(t => t.tx_id);

        // Fetch all rows belonging to exactly these groups (Ensures no group is sliced in half)
        const batchRows: any[] = await prisma.$queryRaw`
           SELECT * FROM general_ledger 
           WHERE COALESCE(transaction_group_id, transaction_id, id) IN (${txIds.join("','")})
        `; // Note: safe string embedding needed natively

        // Workaround for raw IN array injection via Prisma
        const exactRows = await prisma.generalLedger.findMany({
            where: {
                OR: [
                    { transaction_group_id: { in: txIds } },
                    { transaction_id: { in: txIds } },
                    { id: { in: txIds } }
                ]
            }
        });

        // Group rows locally
        const memoryGroup: Record<string, any[]> = {};
        for (const row of exactRows) {
            const key = row.transaction_group_id || row.transaction_id || row.id;
            if (!memoryGroup[key]) memoryGroup[key] = [];
            memoryGroup[key].push(row);
        }

        await prisma.$transaction(async (tx) => {
            for (const group of Object.values(memoryGroup)) {
                if (group.length === 0) continue;
                const repRow = group[0];
                const financialTxId = uuidv4();
                
                // Fallback deterministic key for retries
                const idempotencyKey = repRow.idempotency_key || `MIG_${repRow.id}_${financialTxId}`;

                await tx.financialTransactions.create({
                    data: {
                        id: financialTxId,
                        idempotency_key: idempotencyKey,
                        status: 'COMPLETED',
                        reference: 'HISTORICAL_MIGRATION',
                        metadata: { 
                            legacy_category: repRow.category, 
                            source_table: repRow.source_table,
                            source_id: repRow.source_id,
                            transaction_date: repRow.transaction_date || repRow.created_at
                        }
                    }
                });

                let groupDebits = 0;
                let groupCredits = 0;

                for (const row of group) {
                    const amount = Number(row.amount || 0);
                    if (amount === 0) continue;

                    let targetAccountId;
                    const scope = (row.ledger_scope || row.scope || '').toLowerCase();
                    
                    if (scope === 'wallet') {
                        targetAccountId = walletMap[`USER_${row.user_id}`] || walletMap[`ID_${row.account_id || row.account}`];
                    }

                    if (!targetAccountId) {
                        targetAccountId = mapCategoryToMasterAccount(row.category);
                    }

                    let type = 'CREDIT';
                    const direction = (row.direction || row.entry_type || '').toLowerCase();
                    if (direction === 'cash_out' || direction === 'debit') type = 'DEBIT';

                    await tx.financialEntries.create({
                        data: {
                            id: uuidv4(),
                            transaction_id: financialTxId,
                            account_id: targetAccountId,
                            amount: amount,
                            type: type,
                            created_at: new Date(row.created_at || new Date())
                        }
                    });

                    if (type === 'CREDIT') { groupCredits += amount; globalCredits += amount; } 
                    else { groupDebits += amount; globalDebits += amount; }
                }

                // Plug mathematical discrepancies logically using SUSPENSE
                const variance = groupCredits - groupDebits;
                if (Math.abs(variance) > 0.0001) {
                    const plugAmount = Math.abs(variance);
                    const plugType = variance > 0 ? 'DEBIT' : 'CREDIT';

                    await tx.financialEntries.create({
                        data: {
                            id: uuidv4(),
                            transaction_id: financialTxId,
                            account_id: MASTER_ACCOUNTS.SUSPENSE.id,
                            amount: plugAmount,
                            type: plugType,
                            created_at: new Date()
                        }
                    });

                    if (plugType === 'CREDIT') globalCredits += plugAmount;
                    else globalDebits += plugAmount;
                }
            }
        }, { maxWait: 100000, timeout: 600000 });

        lastSeenId = txIds[txIds.length - 1]; // Move cursor forward
        processedGroups += txIds.length;
        console.log(`   └─ Pushed batch through Ledger Layer (Processed ${processedGroups} / ~${totalTransactions} event groups)`);
    }

    console.log(`\n✅ MIGRATION STREAMING COMPLETE (Cursor Finished at ${lastSeenId})`);
}

runProductionMigration()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
