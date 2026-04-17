import { Router } from 'express';
import { cfoController } from './cfo.controller';
import { attachRequestId } from '../../shared/middleware/request-id.middleware';
import { supabaseAuthGuard } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

// Middleware enforces that the requester is a CFO or authorized.
// Ensures idempotency header is checked.
router.post(
  '/portfolios/:id/topup',
  supabaseAuthGuard,
  authorize({ roles: ['CFO', 'CEO', 'MANAGER'] }),
  attachRequestId,
  cfoController.processPortfolioTopUp
);

router.post(
  '/portfolios/:id/merge-pending',
  supabaseAuthGuard,
  authorize({ roles: ['CFO', 'CEO', 'MANAGER'] }),
  attachRequestId,
  cfoController.mergePendingTopUps
);

export default router;
