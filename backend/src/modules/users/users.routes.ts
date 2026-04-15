import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All users routes are protected by the Supabase JWKS zero-trust identity gate.
// This ensures req.user.id === supabase_user_id, which is the golden rule of silent migration.
router.use(authenticate);

router.get('/me', usersController.getMe);
router.patch('/me', usersController.patchMe);

export default router;
