import { Router } from 'express';

import authRoutes from '../routes/auth.routes';
import walletsRoutes from '../routes/wallets.routes';
import rentRequestsRoutes from '../routes/rent-requests.routes';
import applicationsRoutes from '../routes/applications.routes';
import uploadRoutes from '../routes/upload.routes';
import supporterRoutes from '../routes/supporter.routes';
import tenantRoutes from '../routes/tenant.routes';
import agentRoutes from '../routes/agent.routes';
import cfoRoutes from '../routes/cfo.routes';
import funderRoutes from '../routes/funder.routes';
import rolesRoutes from '../routes/roles.routes';

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
