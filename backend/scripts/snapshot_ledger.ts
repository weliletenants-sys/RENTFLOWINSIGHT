import prisma from '../src/prisma/prisma.client';
import { CfoService } from '../src/services/cfo.service';
import fs from 'fs';
import path from 'path';

async function takeSnapshot() {
    console.log('📸 Taking deep structural snapshot of V2 Financial Engine...');
    
    const overview = await CfoService.getLedgerOverview();
    const wallets = await prisma.financialAccounts.aggregate({ where: { type: 'WALLET' }, _sum: { balance: true } });
    
    const snapshot = {
        timestamp: new Date().toISOString(),
        total_assets: overview.cash + overview.receivables,
        total_liabilities: overview.liabilities,
        total_revenue: overview.revenue,
        total_expenses: overview.expenses,
        total_wallet_holdings: wallets._sum.balance || 0
    };

    const fileName = path.join(process.cwd(), `ledger_snapshot_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify(snapshot, null, 2));
    
    console.log(`✅ Snapshot firmly secured at: ${fileName}`);
    console.log(JSON.stringify(snapshot, null, 2));

    console.log('\n👉 Instructions: Run this again in 1 hour. Use a diff tool to compare the files. If unexpected drift occurs on locked accounts, halt operations immediately.');
}

takeSnapshot().catch(console.error).finally(() => prisma.$disconnect());
