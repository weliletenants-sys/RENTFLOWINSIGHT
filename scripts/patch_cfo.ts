import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '../backend/src/controllers/cfo.controller.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace Block 1: Rent requests pending repayment + additional aggregates
const block1Search = `    let pendingRepayments = 0;
    for (const rr of rentRequests) {
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) pendingRepayments += remaining;
    }`;

const block1Replace = `    let pendingRepayments = 0;
    let rentFacilitated = 0;
    for (const rr of rentRequests) {
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) pendingRepayments += remaining;
      rentFacilitated += Number(rr.amount);
    }

    const transfers = await prisma.generalLedger.aggregate({
      where: { category: 'transfer', ...dateFilter },
      _sum: { amount: true }
    });

    const commissions = await prisma.generalLedger.aggregate({
      where: { category: 'commission', ...dateFilter },
      _sum: { amount: true }
    });

    const agentEarnings = await prisma.generalLedger.aggregate({
      where: { category: 'agent_earning', ...dateFilter },
      _sum: { amount: true }
    });

    const bonuses = await prisma.generalLedger.aggregate({
      where: { category: 'bonus', ...dateFilter },
      _sum: { amount: true }
    });`;

// Replace Block 2: The exact metrics return object
const block2Search = `        transfers: 0,
        agentEarnings: 0,
        commissions: 0,
        bonuses: 0,
        rentFacilitated: 0`;

const block2Replace = `        transfers: transfers._sum.amount || 0,
        agentEarnings: agentEarnings._sum.amount || 0,
        commissions: commissions._sum.amount || 0,
        bonuses: bonuses._sum.amount || 0,
        rentFacilitated`;

content = content.replace(block1Search.replace(/\n/g, '\r\n'), block1Replace.replace(/\n/g, '\r\n'));
content = content.replace(block2Search.replace(/\n/g, '\r\n'), block2Replace.replace(/\n/g, '\r\n'));
// the issue was possibly \r\n vs \n

// Fallback if the original was \n instead of \r\n
if (content.indexOf('agentEarnings._sum') === -1) {
  content = content.replace(block1Search, block1Replace);
  content = content.replace(block2Search, block2Replace);
}

fs.writeFileSync(file, content);
console.log('PATCHED CFO CONTROLLER');
