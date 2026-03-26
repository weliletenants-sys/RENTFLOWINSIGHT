import { Router } from 'express';
import { 
  getPoolBalance, 
  getPendingRentRequests, 
  deployCapitalToTenant,
  getPendingDeposits,
  approveDeposit,
  getLedgerRecords,
  getAllUsers,
  updateUserRole,
  getAgentFloats,
  issueAgentAdvance,
  getTenantStatuses,
  triggerTenantEviction
} from '../../controllers/manager.controller';
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

// Financial Ops Hub
router.get('/ops/deposits/pending', getPendingDeposits);
router.post('/ops/deposits/:id/approve', approveDeposit);
router.get('/ops/ledger', getLedgerRecords);

// Platform User Operations matrix
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

// Field Agent Operations Pipeline
router.get('/agents/float', getAgentFloats);
router.post('/agents/:id/advance', issueAgentAdvance);

// Tenant Operations (Compliance & Evictions)
router.get('/tenants/status', getTenantStatuses);
router.post('/tenants/:id/eviction', triggerTenantEviction);

export default router;
