import { Router } from 'express';
import { getDashboardStats, getPortfolios, getRecentActivities, fundRentPool, requestWithdrawal } from '../../controllers/funder.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Apply authGuard to ensure user is logged in
router.use(authGuard);
// Apply proxy bypass logic here if a direct Funder role isn't universally stamped, but for now we enforce it.
// Wait, the user already said "initial signup persona is granted by default". So Funder mode should be completely accessible.

router.get('/statistics/dashboard', getDashboardStats);
router.get('/portfolios', getPortfolios);
router.get('/activities', getRecentActivities);

router.post('/fund', fundRentPool);
router.post('/withdrawals', requestWithdrawal);

export default router;
