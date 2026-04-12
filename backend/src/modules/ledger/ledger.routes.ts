import { Router } from 'express';
import { LedgerController } from './ledger.controller';
import { ensureAuthenticated, rolesGuard } from '../../shared/middleware/auth.middleware';

const router = Router();

// Endpoint: GET /admin/system/health/finance
// STRICT RESTRICTION: Only Admin scopes (executives, developers) should execute table aggregations
router.get('/health/finance', ensureAuthenticated, rolesGuard(['admin', 'coo', 'cfo']), LedgerController.getHealth);

export default router;
