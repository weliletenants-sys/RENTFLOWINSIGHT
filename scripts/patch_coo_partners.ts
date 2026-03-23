import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '../backend/src/controllers/coo.controller.ts');
let content = fs.readFileSync(file, 'utf8');

const searchBlock = `export const getPartners = async (req: Request, res: Response) => {
  try {
    const escalations = await prisma.partnerEscalations.findMany({
      take: 50,
      orderBy: { created_at: 'desc' }
    });

    res.json(escalations);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};`;

const replaceBlock = `export const getPartners = async (req: Request, res: Response) => {
  try {
    const escalations = await prisma.partnerEscalations.findMany({
      take: 50,
      orderBy: { created_at: 'desc' }
    });

    // Real active partners
    const funders = await prisma.profiles.findMany({
      where: { role: 'FUNDER' },
      take: 50
    });

    // Aggregate portfolios for each
    const investors = await Promise.all(funders.map(async f => {
      const ports = await prisma.investorPortfolios.findMany({ where: { user_id: f.id }});
      const returns = await prisma.walletTransactions.aggregate({
        where: { user_id: f.id, transaction_type: 'RETURN_PAYOUT' },
        _sum: { amount: true }
      });
      return {
        id: f.id,
        name: f.full_name,
        totalInvested: ports.reduce((acc, p) => acc + Number(p.investment_amount), 0),
        returnsPaid: returns._sum.amount || 0,
        activeDeals: ports.length,
        frozen: f.is_frozen
      };
    }));

    res.json({ escalations, investors });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};`;

content = content.replace(searchBlock.replace(/\n/g, '\r\n'), replaceBlock.replace(/\n/g, '\r\n'));

if (content.indexOf('// Real active partners') === -1) {
    content = content.replace(searchBlock, replaceBlock);
}

fs.writeFileSync(file, content);
console.log('PATCHED COO PARTNERS');
