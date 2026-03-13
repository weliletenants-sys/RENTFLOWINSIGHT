import { Router } from 'express';
import { getDashboardStats, getVirtualHouses, fundPool, proxyInvest } from '../controllers/supporter.controller';
import { authGuard, rolesGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getDashboardStats);
router.get('/virtual-houses', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getVirtualHouses);
router.post('/fund-pool', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), fundPool);

router.post('/proxy-invest', authGuard, rolesGuard(['AGENT']), proxyInvest);

export default router;
