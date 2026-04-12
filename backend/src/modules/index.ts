import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import adminAuthRoutes from './admin/adminAuth.routes';
import usersRoutes from './users/users.routes';
import agentsRoutes from './agents/agents.routes';
import tenantsRoutes from './tenants/tenants.routes';
import paymentsRoutes from './payments/payments.routes';
import roiRoutes from './roi/roi.routes';
import ledgerRoutes from './ledger/ledger.routes';

const modulesRouter = Router();

// Modular Routes Layer
modulesRouter.use('/auth', authRoutes);
modulesRouter.use('/admin/auth', adminAuthRoutes);
modulesRouter.use('/users', usersRoutes);
modulesRouter.use('/agents', agentsRoutes);
modulesRouter.use('/tenants', tenantsRoutes);
modulesRouter.use('/payments', paymentsRoutes);
modulesRouter.use('/roi', roiRoutes);
modulesRouter.use('/admin/system', ledgerRoutes);

// Export to be mounted inside App.js or server
export default modulesRouter;
