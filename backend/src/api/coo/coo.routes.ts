import { Router } from 'express';
import { 
  getOverviewMetrics,
  getTransactions,
  getCollections,
  getWallets,
  getAnalytics,
  getWithdrawals,
  getPartners,
  getTenants,
  getAlerts,
  getStaff,
  createOpportunity,
  getOpportunities,
  getGlobalUsersList,
  deleteGlobalUsers,
  getUserProfile,
  updateUserProfile
} from '../../controllers/coo.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Diagnostic test route
router.get('/users-test', getGlobalUsersList);

router.use(authGuard);
router.use(rolesGuard(['SUPER_ADMIN', 'COO']));

router.get('/users', getGlobalUsersList);
router.delete('/users', deleteGlobalUsers);
router.get('/users/:id', getUserProfile);
router.patch('/users/:id', updateUserProfile);

router.get('/metrics/overview', getOverviewMetrics);
router.get('/metrics/transactions', getTransactions);
router.get('/metrics/collections', getCollections);
router.get('/metrics/wallets', getWallets);
router.get('/metrics/analytics', getAnalytics);
router.get('/metrics/withdrawals', getWithdrawals);
router.get('/metrics/partners', getPartners);
router.get('/metrics/tenants', getTenants);
router.get('/metrics/alerts', getAlerts);
router.get('/metrics/staff', getStaff);

// Funder Opportunities Integration
router.post('/opportunities', createOpportunity);
router.get('/opportunities', getOpportunities);

export default router;
