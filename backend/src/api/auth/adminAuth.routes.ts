import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { adminLogin } from '../../controllers/auth.controller';
import { logout } from '../../controllers/auth.controller';
import { ensureAdminAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many admin login attempts, please try again later' }
});

router.post('/login', loginLimiter, adminLogin);
router.post('/logout', ensureAdminAuthenticated, logout);

export default router;
