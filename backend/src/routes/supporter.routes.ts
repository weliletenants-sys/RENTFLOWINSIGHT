import { Router } from 'express';
import { getDashboardStats, getVirtualHouses, fundPool, proxyInvest, funderSignup, funderOnboard, getInvestmentOptions, cooProxyInvest, requestWithdrawal, processRoi } from '../controllers/supporter.controller';
import { authGuard, rolesGuard } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', funderSignup);
router.post('/onboard', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), funderOnboard);

router.get('/investment-options', getInvestmentOptions);

router.get('/dashboard', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getDashboardStats);
router.get('/virtual-houses', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getVirtualHouses);
router.post('/fund-pool', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), fundPool);

router.post('/proxy-invest', authGuard, rolesGuard(['AGENT']), proxyInvest);
router.post('/coo-proxy-invest', authGuard, rolesGuard(['COO', 'ADMIN']), cooProxyInvest);
router.post('/request-withdrawal', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), requestWithdrawal);
router.post('/process-roi', processRoi);

export default router;
