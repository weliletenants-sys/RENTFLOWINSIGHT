import { Router } from 'express';
import { LedgerController } from './ledger.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

// Endpoint: GET /admin/system/health/finance
// STRICT RESTRICTION: Only Admin scopes (executives, developers) should execute table aggregations
router.get('/health/finance', 
    authenticate, 
    authorize({ roles: ['ADMIN', 'COO', 'CFO'], scopes: ['ledger.health.read'] }), 
    LedgerController.getHealth
);

// Endpoint: POST /admin/system/transfer
// ONLY Operations roles should execute core manual ledger routing
router.post('/transfer', 
    authenticate, 
    authorize({ roles: ['ADMIN', 'CFO', 'FINOPS'], scopes: ['ledger.transfer.execute'] }), 
    LedgerController.transfer
);

export default router;

