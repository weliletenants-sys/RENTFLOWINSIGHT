import { Router } from 'express';
import { getCrmMetrics } from './crm.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/metrics', authGuard, rolesGuard(['SUPER_ADMIN', 'CRM']), getCrmMetrics);

export default router;
