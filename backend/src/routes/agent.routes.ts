import { Router } from 'express';
import { getKycStatus, submitKyc, getRecruitmentStats, requestAdvance, getAdvances } from '../controllers/agent.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/kyc-status', authGuard, getKycStatus);
router.post('/kyc/submit', authGuard, submitKyc);
router.get('/recruitment-stats', authGuard, getRecruitmentStats);

// Advance Requests Endpoints
router.get('/advances', authGuard, getAdvances);
router.post('/advances/request', authGuard, requestAdvance);

export default router;
