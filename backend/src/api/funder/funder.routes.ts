import { Router } from 'express';
import { getDashboardStats, getPortfolios, getRecentActivities, fundRentPool, requestWithdrawal, getOpportunities } from '../../controllers/funder.controller';
import { uploadAvatar, uploadKycDocuments, getKycStatus } from '../../controllers/funder.kyc.controller';
import { uploadS3 } from '../../services/s3.service';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Apply authGuard to ensure user is logged in
router.use(authGuard);
// Apply proxy bypass logic here if a direct Funder role isn't universally stamped, but for now we enforce it.
// Wait, the user already said "initial signup persona is granted by default". So Funder mode should be completely accessible.

router.get('/statistics/dashboard', getDashboardStats);
router.get('/portfolios', getPortfolios);
router.get('/activities', getRecentActivities);
router.get('/opportunities', getOpportunities);

router.post('/fund', fundRentPool);
router.post('/withdrawals', requestWithdrawal);

// --- KYC File Storage ---
router.post('/kyc/avatar', uploadS3.single('avatar'), uploadAvatar);
router.post('/kyc/documents', uploadS3.fields([{ name: 'front_id', maxCount: 1 }, { name: 'back_id', maxCount: 1 }]), uploadKycDocuments);

export default router;
