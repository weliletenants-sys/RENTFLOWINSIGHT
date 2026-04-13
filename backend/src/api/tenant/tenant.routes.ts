import { Router } from 'express';
import { getRentProgress, getRecentActivities, getAgreementStatus, acceptAgreement, payRent } from '../../controllers/tenant.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/rent-progress', authGuard, getRentProgress);
router.get('/activities', authGuard, getRecentActivities);
router.get('/agreement-status', authGuard, getAgreementStatus);
router.post('/accept-agreement', authGuard, acceptAgreement);
router.post('/rent/pay', authGuard, payRent);

export default router;
