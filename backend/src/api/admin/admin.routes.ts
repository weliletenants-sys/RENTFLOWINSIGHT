import { Router } from 'express';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';
import { getRequisitions, approveRequisition, rejectRequisition } from '../../controllers/admin.personas.controller';
import { getGlobalReconciliation, resolveWalletMismatch } from '../../controllers/admin.cfo.controller';

const router = Router();

// All Admin Hub routes require authentication AND high-level executive roles
router.use(authGuard);
router.use(rolesGuard(['CEO', 'COO', 'CFO', 'CRM', 'admin']));

// --- CRM / COO Requisition Management ---
router.get('/requisitions', getRequisitions);
router.post('/requisitions/:id/approve', approveRequisition);
router.post('/requisitions/:id/reject', rejectRequisition);

// --- CFO Financial Controls ---
router.get('/reconciliation', getGlobalReconciliation);
router.post('/reconciliation/:userId/resolve', resolveWalletMismatch);

export default router;
