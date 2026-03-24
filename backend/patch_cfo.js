const fs = require('fs');

let code = fs.readFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', 'utf8');

// 1. Replace start_date parsing in getOverview
code = code.replace(
  'const { start_date, end_date } = req.query;',
  'const { dateFilter, createdFilter } = getDateFilters(req.query);'
);

// 2. Remove manual dateFilter build
const manualFilter = `const dateFilter: any = {};
    if (start_date || end_date) {
      dateFilter.transaction_date = {};
      // Simplistic string filtering, in production would use true DateTime
      if (start_date) dateFilter.transaction_date.gte = String(start_date);
      if (end_date) dateFilter.transaction_date.lte = String(end_date);
    }

    const createdFilter: any = {};
    if (start_date || end_date) {
      createdFilter.created_at = {};
      if (start_date) createdFilter.created_at.gte = String(start_date);
      if (end_date) createdFilter.created_at.lte = String(end_date);
    }`;

code = code.replace(manualFilter, '');

// 3. Update Counts to use createdFilter
code = code.replace('prisma.profiles.count({ where: { verified: true } })', 'prisma.profiles.count({ where: { verified: true, ...createdFilter } })');
code = code.replace("prisma.userRoles.count({ where: { role: 'AGENT', enabled: true } })", "prisma.userRoles.count({ where: { role: 'AGENT', enabled: true, ...createdFilter } })");
code = code.replace("prisma.userRoles.count({ where: { role: 'TENANT', enabled: true } })", "prisma.userRoles.count({ where: { role: 'TENANT', enabled: true, ...createdFilter } })");
code = code.replace("prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true } })", "prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true, ...createdFilter } })");

// 4. Update getStatements to use dateFilter
code = code.replace(
  "export const getStatements = async (req: Request, res: Response) => {\n  try {\n    const revenueSum = await prisma.generalLedger.aggregate({\n      where: { category: 'platform_fee', direction: 'credit' },",
  "export const getStatements = async (req: Request, res: Response) => {\n  try {\n    const { dateFilter } = getDateFilters(req.query);\n    const revenueSum = await prisma.generalLedger.aggregate({\n      where: { category: 'platform_fee', direction: 'credit', ...dateFilter },"
);

code = code.replace(
  "const expenseSum = await prisma.generalLedger.aggregate({\n      where: { \n        direction: 'debit',\n        category: { in: ['commission', 'agent_payout', 'staff_salary', 'bonus'] }\n      },",
  "const expenseSum = await prisma.generalLedger.aggregate({\n      where: { \n        direction: 'debit',\n        category: { in: ['commission', 'agent_payout', 'staff_salary', 'bonus'] },\n        ...dateFilter\n      },"
);

fs.writeFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', code);
console.log('Patch complete.');
