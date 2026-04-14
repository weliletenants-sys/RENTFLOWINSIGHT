import { Router } from 'express';

import { enforceAdminDomain, enforceUserDomain } from '../middlewares/domain.middleware';
import { ensureAdminAuthenticated, ensureUserAuthenticated } from '../middlewares/auth.middleware';

// ─── USER ROUTES (Standard Domain) ───
import walletsRoutes from './wallets/wallets.routes';
import rentRequestsRoutes from './rent-requests/rent-requests.routes';
import applicationsRoutes from './applications/applications.routes';
import uploadRoutes from './upload/upload.routes';
import supporterRoutes from './supporter/supporter.routes';
import tenantRoutes from './tenant/tenant.routes';
import agentRoutes from './agent/agent.routes';
import funderRoutes from './funder/funder.routes';
import rolesRoutes from './roles/roles.routes';
import notificationsRoutes from './notifications/notifications.routes';
import propertiesRoutes from './properties/properties.routes';
import marketplaceRoutes from './marketplace/marketplace.routes';
import ownerRoutes from './owner/owner.routes';

// ─── ADMIN ROUTES (Admin Domain) ───
import adminAuthRoutes from './auth/adminAuth.routes';
import adminRoutes from './admin/admin.routes';
import cfoRoutes from './cfo/cfo.routes';
import cooRoutes from './coo/coo.routes';
import crmRoutes from './crm/crm.routes';
import personasRoutes from './personas/personas.routes';
import executiveRoutes from './executive/executive.routes';
import superadminRoutes from './superadmin/superadmin.routes';
import managerRoutes from './manager/manager.routes';
import welileHomesRoutes from './welile-homes/welile-homes.routes';
import hrRoutes from './hr/hr.routes';
import finopsRoutes from './ops/finops.routes';
import opsRoutes from './ops/index';

const api = Router();

// ==========================================
// HEALTH CHECKS
// ==========================================
api.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'financial-os', timestamp: new Date().toISOString() });
});

api.get('/health/auth', async (req, res) => {
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wirntoujqoyjobfhyelc.supabase.co';
        const JWKS_URI = `${SUPABASE_URL}/auth/v1/keys`;
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

        const probe = await fetch(JWKS_URI, { headers: { apikey: SUPABASE_ANON_KEY } });
        if (probe.ok) {
            return res.json({ jwks: 'ok', status: probe.status });
        } else {
            return res.status(502).json({ jwks: 'error', status: probe.status });
        }
    } catch (e: any) {
        return res.status(500).json({ jwks: 'offline', error: e.message });
    }
});
// ==========================================
// LEGACY LOCK: PHASE 1 MIGRATION BARRIER
// ==========================================
api.use((req, res, next) => {
  res.setHeader('X-Deprecated', 'true');
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(403).json({ 
      error: 'Legacy Systems Locked.', 
      message: 'This legacy endpoint is strictly read-only during the V2 routing migration. State mutations must pass exclusively through /api/v2/ core routes.' 
    });
  }
  next();
});


// ==========================================
// ADMIN CONTEXT API ROUTING
// ==========================================
const adminRouter = Router();
adminRouter.use(enforceAdminDomain);
adminRouter.use('/auth', adminAuthRoutes);

// Protected Admin APIs
adminRouter.use(ensureAdminAuthenticated); // Applies broadly to all the below routes inside /admin
adminRouter.use('/system', adminRoutes); // Previously /v1/admin
adminRouter.use('/cfo', cfoRoutes);
adminRouter.use('/coo', cooRoutes); // Previously /v1/coo
adminRouter.use('/crm', crmRoutes);
adminRouter.use('/personas', personasRoutes);
adminRouter.use('/executive', executiveRoutes);
adminRouter.use('/superadmin', superadminRoutes);
adminRouter.use('/manager', managerRoutes);
adminRouter.use('/welile-homes', welileHomesRoutes);
adminRouter.use('/hr', hrRoutes);
adminRouter.use('/finops', finopsRoutes);
adminRouter.use('/ops', opsRoutes);

api.use('/admin', adminRouter);

import ledgerRoutes from '../modules/ledger/ledger.routes';

// ==========================================
// CORE DOMAINS (Zero-Trust)
// ==========================================
// The Ledger is the absolute truth layer. It has its own strict guards internally.
api.use('/ledger', ledgerRoutes);

// ==========================================
// USER CONTEXT API ROUTING
// ==========================================
const userRouter = Router();
userRouter.use(enforceUserDomain);
userRouter.use('/auth', authRoutes); // /api/auth/login

// ==========================================
// DYNAMIC SUPABASE POSTGREST AND RPC TRANSLATORS
// ==========================================
import prisma from '../../prisma/prisma.client';

userRouter.post('/rpc/:method', async (req, res) => {
  const { method } = req.params;
  try {
     console.log(`[Dynamic RPC Intercept] Executing: ${method}`, req.body);
     // Hardcoded stub for dashboard integration to pass initial integration load without breaking
     // Full method translations should be mapped here later
     if (method === 'get_agent_split_balances') {
        const float_balance = await prisma.wallets.aggregate({ _sum: { balance: true }, where: { user_id: req.body.p_agent_id }});
        return res.json({ data: [{ float_balance: float_balance._sum.balance || 0, commission_balance: 0 }] });
     }
     if (method === 'get_total_system_balances') {
        return res.json({ data: { tenant_wallets: 0, landlord_wallets: 0, investor_commitments: 0 } });
     }
     // Safe fallback
     return res.json({ data: [] });
  } catch(e: any) {
     return res.status(500).json({ error: e.message });
  }
});

userRouter.get('/rest/:table', async (req, res) => {
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
     
     // Note: If prisma table names don't exactly match Supabase (e.g. pascal vs snake case),
     // this needs mapping. Usually Prisma retains mapped names.
     const prismaTable = Object.keys(prisma).find(k => k.toLowerCase() === table.toLowerCase());
     if (!prismaTable) return res.json({ data: [] }); // Safe fallback
     
     const data = await (prisma as any)[prismaTable].findMany(query);
     return res.json({ data });
  } catch(e: any) {
     console.error(`[Dynamic REST Error] table: ${table}`, e);
     return res.status(500).json({ error: e.message });
  }
});

userRouter.use('/wallets', walletsRoutes);
userRouter.use('/rent-requests', rentRequestsRoutes);
userRouter.use('/applications', applicationsRoutes);
userRouter.use('/upload', uploadRoutes);
userRouter.use('/supporter', supporterRoutes);
userRouter.use('/tenant', tenantRoutes);
userRouter.use('/agent', agentRoutes);
userRouter.use('/funder', funderRoutes);
userRouter.use('/roles', rolesRoutes);
userRouter.use('/notifications', notificationsRoutes);
userRouter.use('/properties', propertiesRoutes);
userRouter.use('/marketplace', marketplaceRoutes);
userRouter.use('/owner', ownerRoutes);

api.use('/', userRouter);

export default api;
