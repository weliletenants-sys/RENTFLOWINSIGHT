import { Router } from 'express';
import { getDashboardStats, getPortfolios, getRecentActivities } from '../controllers/funder.controller';
import { authGuard, rolesGuard } from '../middlewares/auth.middleware';

const router = Router();

// Apply authGuard to ensure user is logged in
router.use(authGuard);
// Apply rolesGuard to ensure user is a FUNDER
router.use(rolesGuard(['FUNDER']));

router.get('/dashboard', getDashboardStats);
router.get('/portfolios', getPortfolios);
router.get('/activities', getRecentActivities);

export default router;
