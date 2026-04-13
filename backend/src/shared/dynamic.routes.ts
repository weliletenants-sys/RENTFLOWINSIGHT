import { Router } from 'express';
import prisma from '../prisma/prisma.client';

export const dynamicRpcCatcher = Router();
export const dynamicRestCatcher = Router();

dynamicRpcCatcher.post('/:method', async (req, res) => {
  const { method } = req.params;
  try {
     console.log(`[Dynamic RPC Intercept] Executing: ${method}`, req.body);
     if (method === 'get_agent_split_balances') {
        const float_balance = await prisma.wallets.aggregate({ _sum: { balance: true }, where: { user_id: req.body.p_agent_id }});
        return res.json({ data: [{ float_balance: float_balance._sum.balance || 0, commission_balance: 0 }] });
     }
     if (method === 'get_total_system_balances') {
        return res.json({ data: { tenant_wallets: 0, landlord_wallets: 0, investor_commitments: 0 } });
     }
     return res.json({ data: [] });
  } catch(e: any) {
     return res.status(500).json({ error: e.message });
  }
});

dynamicRestCatcher.get('/:table', async (req, res) => {
  const { table } = req.params;
  try {
     console.log(`[Dynamic REST Intercept] Querying: ${table}`, req.query);
     let query: any = { where: {} };
     for(const [key, val] of Object.entries(req.query)) {
        if(key === 'select') continue;
        if(typeof val === 'string' && val.startsWith('eq.')) {
           query.where[key] = val.replace('eq.', '');
        }
     }
     
     const prismaTable = Object.keys(prisma).find(k => k.toLowerCase() === table.toLowerCase());
     if (!prismaTable) return res.json({ data: [] });
     const data = await (prisma as any)[prismaTable].findMany(query);
     
     // AUTO-SYNC: If a Live User logs in but doesn't exist in local AWS RDS, auto-stub them!
     if (table.toLowerCase() === 'profiles' && data.length === 0 && query.where.id) {
         try {
             await (prisma as any).profiles.create({
                 data: {
                     id: query.where.id,
                     full_name: 'Migrated User',
                     phone: '000000000',
                     role: 'TENANT',
                     verified: true
                 }
             });
             return res.json({ data: [{ 
                 id: query.where.id, 
                 full_name: 'Migrated User', 
                 phone: '000000000', 
                 role: 'TENANT',
                 verified: true
             }] });
         } catch (e) { /* ignore */ }
     }
     
     return res.json({ data });
  } catch(e: any) {
     console.error(`[Dynamic REST Error] table: ${table}`, e);
     return res.status(500).json({ error: e.message });
  }
});
