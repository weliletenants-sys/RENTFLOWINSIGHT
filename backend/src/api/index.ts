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
import funderRoutes from './funder/funder.routes';
import rolesRoutes from './roles/roles.routes';

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
api.use('/funder', funderRoutes);
api.use('/roles', rolesRoutes);

export default api;
