import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '../backend/src/controllers/coo.controller.ts');
let content = fs.readFileSync(file, 'utf8');

const searchBlock = `export const getAnalytics = async (req: Request, res: Response) => {
  try {
    res.json({
      revenueTrends: [
        { month: 'Jan', value: 1200000 },
        { month: 'Feb', value: 1900000 },
        { month: 'Mar', value: 2400000 }
      ],
      paymentMethods: [
        { name: 'Mobile Money', value: 65 },
        { name: 'Bank Transfer', value: 28 },
        { name: 'Cash', value: 7 }
      ]
    });`;

const replaceBlock = `export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const collections = await prisma.agentCollections.findMany();
    let momo = 0, bank = 0, cash = 0, totalAmount = 0;
    
    // Natively group records over the ledger history
    collections.forEach(c => {
      totalAmount += c.amount;
      const method = (c.payment_method || '').toUpperCase();
      if (method.includes('MOMO') || method.includes('MOBILE') || method.includes('MTN') || method.includes('AIRTEL')) momo++;
      else if (method.includes('BANK') || method.includes('TRANSFER')) bank++;
      else cash++;
    });
    
    const totalCount = momo + bank + cash || 1; // avoid division by zero
    
    res.json({
      revenueTrends: [
        { month: 'Aggregate Collection', value: totalAmount }
      ],
      paymentMethods: [
        { name: 'Mobile Money', value: Math.round((momo/totalCount)*100) },
        { name: 'Bank Transfer', value: Math.round((bank/totalCount)*100) },
        { name: 'Cash', value: Math.round((cash/totalCount)*100) }
      ]
    });`;

content = content.replace(searchBlock.replace(/\n/g, '\r\n'), replaceBlock.replace(/\n/g, '\r\n'));

if (content.indexOf('Math.round') === -1) {
  content = content.replace(searchBlock, replaceBlock);
}

fs.writeFileSync(file, content);
console.log('PATCHED COO CONTROLLER');
