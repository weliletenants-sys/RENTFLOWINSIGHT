import { Router } from 'express';
import { getDashboardStats, getVirtualHouses, fundPool, proxyInvest, funderSignup, funderOnboard, getInvestmentOptions, cooProxyInvest, requestWithdrawal, processRoi, getPortfolios, getActivities, dispatchActivations, activateAccount } from '../../controllers/supporter.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/accounts', funderSignup);
router.post('/activations', authGuard, rolesGuard(['ADMIN', 'COO']), dispatchActivations);
router.post('/account-activations', activateAccount);
router.post('/onboarding', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), funderOnboard);

router.get('/investment-options', getInvestmentOptions);

router.get('/dashboard', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getDashboardStats);
router.get('/virtual-houses', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getVirtualHouses);
router.get('/portfolios', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getPortfolios);
router.get('/activities', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), getActivities);
router.post('/funding-pools', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), fundPool);

router.post('/proxy-investments', authGuard, rolesGuard(['AGENT']), proxyInvest);
router.post('/proxy-investments/coo', authGuard, rolesGuard(['COO', 'ADMIN']), cooProxyInvest);
router.post('/withdrawals', authGuard, rolesGuard(['FUNDER', 'SUPPORTER']), requestWithdrawal);
router.post('/roi-processing', processRoi);

export default router;
