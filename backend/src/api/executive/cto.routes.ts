import { Router } from 'express';
import { getCtoMetrics } from './cto.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/metrics', authGuard, rolesGuard(['SUPER_ADMIN', 'CTO']), getCtoMetrics);

export default router;
