import { Router } from 'express';
import { getDashboardStats, getPortfolios, getPortfolioDetails, getRecentActivities, fundRentPool, requestWithdrawal, getOpportunities, updateProfileInfo, topupRentPool, getFunderReportsStats, updatePortfolioDetails, getReferralStats, getROILeaderboard } from '../../controllers/funder.controller';
import { uploadAvatar, uploadKycDocuments, getKycStatus } from '../../controllers/funder.kyc.controller';
import { getPayoutMethods, addPayoutMethod, setPrimaryPayoutMethod, deletePayoutMethod, getRewardMode, updateRewardMode, getWalletOperations, requestWalletWithdrawal, requestDeposit, getPortfolios as getCapitalPortfolios, transferFunds } from '../../controllers/funder.financial.controller';
import { uploadS3 } from '../../services/s3.service';
import { getMandates, addMandate, updateMandateLimit, revokeMandate, restoreMandate } from '../../controllers/funder.proxy.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Apply authGuard to ensure user is logged in
router.use(authGuard);
// Apply proxy bypass logic here if a direct Funder role isn't universally stamped, but for now we enforce it.
// Wait, the user already said "initial signup persona is granted by default". So Funder mode should be completely accessible.

router.get('/statistics/dashboard', getDashboardStats);
router.get('/portfolios', getPortfolios);
router.get('/portfolios/:code', getPortfolioDetails);
router.put('/portfolios/:code/topup', topupRentPool);
router.get('/activities', getRecentActivities);
router.get('/reports/stats', getFunderReportsStats);
router.get('/opportunities', getOpportunities);

router.patch('/portfolios/:code', updatePortfolioDetails);
router.get('/referrals/stats', getReferralStats);
router.get('/referrals/leaderboard', getROILeaderboard);

router.post('/fund', fundRentPool);
router.post('/withdrawals', requestWithdrawal);

// --- KYC File Storage ---
router.post('/kyc/avatar', uploadS3.single('avatar'), uploadAvatar);
router.post('/kyc/documents', uploadS3.fields([{ name: 'front_id', maxCount: 1 }, { name: 'back_id', maxCount: 1 }]), uploadKycDocuments);
router.put('/kyc/profile', updateProfileInfo);

// --- Financial & Payout Methods ---
router.get('/payout-methods', getPayoutMethods);
router.post('/payout-methods', addPayoutMethod);
router.put('/payout-methods/:id/primary', setPrimaryPayoutMethod);
router.delete('/payout-methods/:id', deletePayoutMethod);

// --- Capital & Escrow Management ---
router.get('/financial/reward-mode', getRewardMode);
router.put('/financial/reward-mode', updateRewardMode);
router.get('/financial/wallet-operations', getWalletOperations);
router.post('/financial/wallet-withdraw', requestWalletWithdrawal);
router.post('/financial/wallet-deposit', requestDeposit);
router.post('/financial/transfer', transferFunds);
router.get('/financial/portfolios', getCapitalPortfolios);

// --- Proxy Mandates ---
router.get('/proxy/mandates', getMandates);
router.post('/proxy/mandates', addMandate);
router.put('/proxy/mandates/:id/limit', updateMandateLimit);
router.put('/proxy/mandates/:id/revoke', revokeMandate);
router.put('/proxy/mandates/:id/restore', restoreMandate);

export default router;
