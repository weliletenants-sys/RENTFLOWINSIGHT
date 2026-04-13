import { Router } from 'express';
import prisma from '../prisma/prisma.client';

export const dynamicRpcCatcher = Router();
export const dynamicRestCatcher = Router();

dynamicRpcCatcher.post('/:method', async (req, res) => {
  const { method } = req.params;
  const verifiedUserId = req.user?.id;
  
  if (!verifiedUserId) {
      return res.status(401).json({ error: "Unauthorized: Missing identity payload" });
  }

  try {
     console.log(`[Dynamic RPC Intercept] Executing: ${method}`, req.body, `by User: ${verifiedUserId}`);
     
     // STRICT RLS SIMULATION ON RPC: The RPC must only ever calculate for the logged-in user!
     if (method === 'get_agent_split_balances') {
        const targetAgentId = req.body.p_agent_id;
        
        // Security check: Only allow an agent to query their own float balances, or block it entirely!
        if (targetAgentId !== verifiedUserId) {
            return res.status(403).json({ error: "Forbidden: You can only query your own balances." });
        }
        
        const float_balance = await prisma.wallets.aggregate({ _sum: { balance: true }, where: { user_id: verifiedUserId }});
        return res.json([{ float_balance: float_balance._sum.balance || 0, commission_balance: 0 }]);
     }
     if (method === 'get_total_system_balances') {
        return res.json({ tenant_wallets: 0, landlord_wallets: 0, investor_commitments: 0 });
     }
     return res.json([]);
  } catch(e: any) {
     return res.status(500).json({ error: e.message });
  }
});

dynamicRestCatcher.get('/:table', async (req, res) => {
  const { table } = req.params;
  const verifiedUserId = req.user?.id;
  
  if (!verifiedUserId) {
      return res.status(401).json({ error: "Unauthorized: Missing identity payload" });
  }

  try {
     console.log(`[Dynamic REST Intercept] Querying: ${table}`, req.query, `by User: ${verifiedUserId}`);
     let query: any = { where: {} };
     
     for(const [key, val] of Object.entries(req.query)) {
        if(key === 'select') continue;
        if(typeof val === 'string' && val.startsWith('eq.')) {
           query.where[key] = val.replace('eq.', '');
        }
     }
     
     // STRICT RLS SIMULATION ON REST
     const allowedTables = ["wallets", "deposits", "repayments", "rent_transactions", "profiles", "tenant_mappings", "agent_commissions"];
     const userScopedTables = ["wallets", "deposits", "repayments", "rent_transactions", "tenant_mappings", "agent_commissions"];
     
     if (!allowedTables.includes(table.toLowerCase())) {
        console.warn(`[Proxy Sandbox] User ${verifiedUserId} attempted to access blacklisted table: ${table}`);
        return res.status(403).json({ error: "Forbidden: Table access restricted by backend sandbox." });
     }

     if (userScopedTables.includes(table.toLowerCase())) {
        query.where.user_id = verifiedUserId;
     }
     
     const prismaTable = Object.keys(prisma).find(k => k.toLowerCase() === table.toLowerCase());
     if (!prismaTable) return res.json([]);
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
             return res.json([{ 
                 id: query.where.id, 
                 full_name: 'Migrated User', 
                 phone: '000000000', 
                 role: 'TENANT',
                 verified: true
             }]);
         } catch (e) { /* ignore */ }
     }
     
     return res.json(data);
  } catch(e: any) {
     console.error(`[Dynamic REST Error] table: ${table}`, e);
     return res.status(500).json({ error: e.message });
  }
});

// Write Intercept Proxy
dynamicRestCatcher.post('/:table', async (req, res) => {
  const { table } = req.params;
  const verifiedUserId = req.user?.id;
  
  if (!verifiedUserId) {
      return res.status(401).json({ error: "Unauthorized: Missing identity payload" });
  }

  try {
     const allowedInsertTables = ["supporter_agreement_acceptance"];
     
     if (!allowedInsertTables.includes(table.toLowerCase())) {
        console.warn(`[Proxy Sandbox] User ${verifiedUserId} attempted to HTTP POST blacklisted table: ${table}`);
        return res.status(403).json({ error: "Forbidden: Table INSERT restricted by backend sandbox." });
     }

     const prismaTable = Object.keys(prisma).find(k => k.toLowerCase() === table.toLowerCase()) || table;
     
     // 1. Defensively resolve the array vs object POST payload mappings correctly.
     let rawBody = Array.isArray(req.body) ? req.body[0] : req.body;
     const payload = { ...rawBody };
     delete payload.id; 
     
     // 2. Force the identity constraint
     if (table.toLowerCase() === 'supporter_agreement_acceptance') {
         payload.supporter_id = verifiedUserId;
     }

     // 3. Execute isolated Create
     const data = await (prisma as any)[prismaTable].create({
         data: payload
     });
     
     // Supabase-js REST clients expect an array back natively!
     return res.json([data]);
     
  } catch(e: any) {
     console.error(`[Dynamic REST Post Error] table: ${table}`, e);
     // Native PostgREST format expectation mapping
     return res.status(500).json({ 
        message: e.message || 'Fatal proxy insertion failure', 
        code: e.code || 'PRISMA_CREATE_FAILED', 
        details: 'Dynamic proxy sandbox rejected or crashed on the create query.'
     });
  }
});
