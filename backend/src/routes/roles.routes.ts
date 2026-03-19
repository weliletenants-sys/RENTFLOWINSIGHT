import { Router } from 'express';
import { getMyRoles, requestRole, switchRole } from '../controllers/roles.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

// All roles endpoints require authentication
router.use(authGuard);

router.get('/my-roles', getMyRoles);
router.post('/request', requestRole);
router.post('/switch', switchRole);

export default router;
