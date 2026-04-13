import { Router } from 'express';
import { usersController } from './users.controller';
import { ensureAuthenticated } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(ensureAuthenticated); // Protect all users routes natively

router.get('/me', usersController.getMe);
router.patch('/me', usersController.patchMe);

export default router;
