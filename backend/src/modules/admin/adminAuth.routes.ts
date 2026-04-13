import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { adminAuthController } from './adminAuth.controller';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes cooldown
  max: 3, // Maximum 3 attempts
  message: {
      status: 'error',
      error: 'Too Many Requests',
    detail: 'Too many admin login attempts. Please try again in 3 minutes.'
  },
  keyGenerator: (req) => {
    return (req.ip?.replace(/^::ffff:/, '') || 'unknown') + '_' + req.originalUrl;
  }
});

router.post('/login', loginLimiter, adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);

export default router;
