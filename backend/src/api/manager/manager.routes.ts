import { Router } from 'express';
import { getPoolBalance, getPendingRentRequests, deployCapitalToTenant } from '../../controllers/manager.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Apply Manager & Executive guards to all routes in this namespace
router.use(authGuard);
router.use(rolesGuard(['MANAGER', 'SUPER_ADMIN', 'CEO', 'CFO', 'COO']));

// Dashboard / Command Center Metrics
router.get('/pool-balance', getPoolBalance);

// Rent Pipeline Aggregation
router.get('/rent-requests/pending', getPendingRentRequests);

// Atomic State Migrations (Deployment)
router.post('/rent-requests/:id/deploy', deployCapitalToTenant);

export default router;
