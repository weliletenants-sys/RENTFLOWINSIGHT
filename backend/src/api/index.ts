import { Router } from 'express';

import { enforceAdminDomain, enforceUserDomain } from '../middlewares/domain.middleware';
import { ensureAdminAuthenticated, ensureUserAuthenticated } from '../middlewares/auth.middleware';

// ─── USER ROUTES (Standard Domain) ───
import authRoutes from './auth/auth.routes';
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

const api = Router();

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

api.use('/admin', adminRouter);

// ==========================================
// USER CONTEXT API ROUTING
// ==========================================
const userRouter = Router();
userRouter.use(enforceUserDomain);
userRouter.use('/auth', authRoutes); // /api/auth/login

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

api.use('/', userRouter);

export default api;
