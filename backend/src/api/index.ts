import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import walletsRoutes from './wallets/wallets.routes';
import rentRequestsRoutes from './rent-requests/rent-requests.routes';
import applicationsRoutes from './applications/applications.routes';
import uploadRoutes from './upload/upload.routes';
import supporterRoutes from './supporter/supporter.routes';
import tenantRoutes from './tenant/tenant.routes';
import agentRoutes from './agent/agent.routes';
import cfoRoutes from './cfo/cfo.routes';
import cooRoutes from './coo/coo.routes';
import funderRoutes from './funder/funder.routes';
import rolesRoutes from './roles/roles.routes';
import personasRoutes from './personas/personas.routes';
import adminRoutes from './admin/admin.routes';
import executiveRoutes from './executive/executive.routes';
import notificationsRoutes from './notifications/notifications.routes';
import superadminRoutes from './superadmin/superadmin.routes';

const api = Router();

api.use('/auth', authRoutes);
api.use('/wallets', walletsRoutes);
api.use('/rent-requests', rentRequestsRoutes);
api.use('/applications', applicationsRoutes);
api.use('/upload', uploadRoutes);
api.use('/supporter', supporterRoutes);
api.use('/tenant', tenantRoutes);
api.use('/agent', agentRoutes);
api.use('/cfo', cfoRoutes);
api.use('/v1/coo', cooRoutes);
api.use('/funder', funderRoutes);
api.use('/roles', rolesRoutes);
api.use('/v1/personas', personasRoutes);
api.use('/v1/admin', adminRoutes);
api.use('/superadmin', superadminRoutes);

api.use('/notifications', notificationsRoutes);

// Executive Hub
api.use('/v1/executive', executiveRoutes);

export default api;
