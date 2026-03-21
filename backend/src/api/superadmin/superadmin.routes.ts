import { Router } from 'express';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';
import { 
  assignRole, 
  freezeAccount, 
  deleteAccount, 
  getAuditLogs, 
  getConfig, 
  updateConfig 
} from '../../controllers/superadmin.controller';

const router = Router();

// Strict guard: Only SUPER_ADMIN
router.use(authGuard);
router.use(rolesGuard(['SUPER_ADMIN']));

// Role Governance
router.post('/assign-role', assignRole);

// Account Actions
router.post('/freeze-account', freezeAccount);
router.delete('/delete-account', deleteAccount);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// System Config
router.get('/config', getConfig);
router.put('/config', updateConfig);

export default router;
