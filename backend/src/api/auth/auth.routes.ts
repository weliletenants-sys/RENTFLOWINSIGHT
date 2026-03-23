import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, ssoLogin, sendOTP, verifyOTP, logout, forgotPassword, verifyResetCode, resetPassword } from '../../controllers/auth.controller';
import { changePassword, enable2FA, verify2FA } from '../../controllers/auth.security.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

// Strict limiter for Login (max 5 attempts per 15 mins)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { type: 'https://api.example.com/errors/too-many-requests', title: 'Too Many Requests', status: 429, detail: 'Too many login attempts, please try again after 15 minutes' }
});

// Moderate limiter for Registration & OTP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { type: 'https://api.example.com/errors/too-many-requests', title: 'Too Many Requests', status: 429, detail: 'Too many requests, please try again later' }
});

router.post('/registrations', authLimiter, register);
router.post('/sessions', loginLimiter, login);
router.post('/sessions/sso', loginLimiter, ssoLogin);
router.delete('/sessions', authGuard, logout);
router.post('/otp', authLimiter, sendOTP);
router.post('/otp/verifications', authLimiter, verifyOTP);

// Forgot Password (3-step SMS OTP flow)
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/forgot-password/verify', authLimiter, verifyResetCode);
router.post('/forgot-password/reset', authLimiter, resetPassword);

// Security & 2FA (Authenticated Flows)
router.put('/security/password', authGuard, changePassword);
router.post('/security/2fa/enable', authGuard, enable2FA);
router.post('/security/2fa/verify', authGuard, verify2FA);

export default router;

