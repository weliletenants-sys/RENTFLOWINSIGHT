import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { adminLogin } from '../../controllers/auth.controller';
import { logout } from '../../controllers/auth.controller';
import { ensureAdminAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes cooldown
  max: 3, // Maximum 3 attempts
  message: { message: 'Too many admin login attempts. Please try again in 3 minutes.' }
});

router.post('/login', loginLimiter, adminLogin);
router.post('/logout', ensureAdminAuthenticated, logout);

export default router;
