import { Router } from 'express';
import { RepaymentsController } from './repayments.controller';
import { authMiddleware, requireRole } from '../../shared/middleware/auth.middleware';
import { rateLimiter } from '../../shared/middleware/rate-limiter.middleware';
import { attachRequestId } from '../../shared/middleware/request-id.middleware';

const router = Router();
const controller = new RepaymentsController();

// Universal V2 Middleware stack applied strictly at the boundary
router.use(attachRequestId);
router.use(rateLimiter);

// Protect bounds utilizing Authentication structurally natively mapped
router.use(authMiddleware);

// --- RESTful Execution Boundaries ---

// 1. Tenant specifically clearing bounds
router.post('/tenant', requireRole(['tenant']), controller.repayByTenant.bind(controller));

// 2. Agent explicitly clearing Tenant bounds
router.post('/agent', requireRole(['agent', 'admin']), controller.repayByAgent.bind(controller));

// Further automations / schedulers logically hook here in Phase 3
// e.g. router.post('/automated-scheduler', ...)

export default router;
