import { Router } from 'express';
import { tenantsController } from './tenants.controller';
import { ensureAuthenticated, rolesGuard } from '../../shared/middleware/auth.middleware';

const router = Router();

import { paymentLimiter } from '../../shared/middleware/rate-limiter.middleware';

// Specifically constrain these module boundaries down strictly to TENANTS
router.use(ensureAuthenticated);
router.use(rolesGuard(['TENANT']));

router.post('/rent/pay', paymentLimiter, tenantsController.payRent);

export default router;
