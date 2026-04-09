import { Router } from 'express';
import tenantOpsRoutes from './tenantops.routes';
import agentOpsRoutes from './agentops.routes';
import landlordOpsRoutes from './landlordops.routes';
import partnerOpsRoutes from './partnerops.routes';

const router = Router();

// Financial Ops is intentionally excluded here as it mounts to /admin/finops directly.
router.use('/tenant', tenantOpsRoutes);
router.use('/agent', agentOpsRoutes);
router.use('/landlord', landlordOpsRoutes);
router.use('/partner', partnerOpsRoutes);

export default router;
