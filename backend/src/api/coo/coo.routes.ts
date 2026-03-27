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
  updateUserProfile,
  getPendingDeposits,
  forwardDeposit,
  rejectDeposit,
  updatePortfolio,
  importPartners,
  createManualPortfolio,
  investForPartner,
  validatePartnersImport,
  fundPartnerWallet,
  suspendPartnerAccount,
  topUpPortfolio,
  renewPortfolio,
  deletePortfolio
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

// Deposits Verification Queue
router.get('/deposits/pending', getPendingDeposits);
router.post('/deposits/:id/forward', forwardDeposit);
router.post('/deposits/:id/reject', rejectDeposit);

// Portfolio Structuring
router.patch('/portfolios/:id', updatePortfolio);

// Partner Bulk Imports and Manual Operations
router.post('/partners/import/validate', validatePartnersImport);
router.post('/partners/import', importPartners);
router.post('/partners/:id/portfolios', createManualPortfolio);
router.post('/partners/:id/invest', investForPartner);
router.post('/partners/:id/fund', fundPartnerWallet);
router.post('/partners/:id/suspend', suspendPartnerAccount);

router.post('/portfolios/:id/topup', topUpPortfolio);
router.post('/portfolios/:id/renew', renewPortfolio);
router.delete('/portfolios/:id', deletePortfolio);

export default router;
