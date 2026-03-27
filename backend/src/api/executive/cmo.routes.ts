import { Router } from 'express';
import { getCmoMetrics } from './cmo.controller';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Retrieve all marketing growth telemetry (DAU/MAU) honoring REST standards
router.get('/metrics', authGuard, rolesGuard(['SUPER_ADMIN', 'CMO']), getCmoMetrics);

export default router;
