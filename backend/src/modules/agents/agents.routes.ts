import { Router } from 'express';
import { agentsController } from './agents.controller';
import { ensureAuthenticated, rolesGuard } from '../../shared/middleware/auth.middleware';

const router = Router();

// Securing all agent roots to specifically AGENT profiles
router.use(ensureAuthenticated);
router.use(rolesGuard(['AGENT', 'MANAGER', 'ADMIN']));

router.post('/tenants/tokens/generate', agentsController.generateTenantFormToken);

export default router;
