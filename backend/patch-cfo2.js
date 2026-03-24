const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/controllers/cfo.controller.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const startIndex = lines.findIndex(l => l.includes('export const getStatements ='));

if (startIndex !== -1) {
  const keepLines = lines.slice(0, startIndex);
  const newFunction = `export const getStatements = async (req: Request, res: Response) => {
  try {
    const revenueSum = await prisma.generalLedger.aggregate({
      where: { category: 'platform_fee', direction: 'credit' },
      _sum: { amount: true }
    });
    const revenue = revenueSum._sum.amount || 0;

    const expenseSum = await prisma.generalLedger.aggregate({
      where: { 
        direction: 'debit',
        category: { in: ['commission', 'agent_payout', 'staff_salary', 'bonus'] }
      },
      _sum: { amount: true }
    });
    const expenses = expenseSum._sum.amount || 0;
    const profit = revenue - expenses;

    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true } });
    const liab = wallets._sum.balance || 0;
    
    // Simplistic Receivables check
    const rentRequests = await prisma.rentRequests.findMany({ where: { status: 'DISBURSED' } });
    let outstandingReceivables = 0;
    for (const rr of rentRequests) {
      const remaining = Number(rr.total_repayment) - Number(rr.amount_repaid);
      if (remaining > 0) outstandingReceivables += remaining;
    }

    const assets = liab + outstandingReceivables + profit;
    const equity = assets - liab;

    const coverageRatio = liab > 0 ? (assets / liab) : 2.0;

    res.json({
      solvency: {
        coverageRatio: parseFloat(coverageRatio.toFixed(2)),
        status: coverageRatio > 1.2 ? 'Safe' : coverageRatio >= 1.0 ? 'Warning' : 'Risk'
      },
      incomeStatement: { revenue, expenses, profit },
      balanceSheet: { assets, liabilities: liab, equity }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
`;
  
  const finalContent = keepLines.join('\n') + '\n' + newFunction;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log("Successfully replaced getStatements by array truncation!");
} else {
  console.log("Error: could not find getStatements signature.");
}
