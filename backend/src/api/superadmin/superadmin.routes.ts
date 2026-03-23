import { Router } from 'express';
import { authGuard, rolesGuard } from '../../middlewares/auth.middleware';
import { 
  assignRole, 
  freezeAccount, 
  deleteAccount, 
  getAuditLogs, 
  getConfig, 
  updateConfig,
  getAllUsers,
  getSystemStats
} from '../../controllers/superadmin.controller';

const router = Router();

// Strict guard: Only SUPER_ADMIN
router.use(authGuard);
router.use(rolesGuard(['SUPER_ADMIN']));

// Role Governance
router.get('/users', getAllUsers);
router.post('/assign-role', assignRole);

// Analytics & Stats
router.get('/system-stats', getSystemStats);

// Account Actions
router.post('/freeze-account', freezeAccount);
router.delete('/delete-account', deleteAccount);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// System Config
router.get('/config', getConfig);
router.put('/config', updateConfig);

export default router;
