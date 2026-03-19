import { Router } from 'express';
import { getRentProgress, getRecentActivities } from '../../controllers/tenant.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/rent-progress', authGuard, getRentProgress);
router.get('/recent-activities', authGuard, getRecentActivities);

export default router;
