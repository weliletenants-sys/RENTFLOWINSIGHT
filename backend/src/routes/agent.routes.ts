import { Router } from 'express';
import { getKycStatus, submitKyc, getRecruitmentStats } from '../controllers/agent.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/kyc-status', authGuard, getKycStatus);
router.post('/kyc/submit', authGuard, submitKyc);
router.get('/recruitment-stats', authGuard, getRecruitmentStats);

export default router;
