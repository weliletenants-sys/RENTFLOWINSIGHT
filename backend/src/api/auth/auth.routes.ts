import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, userLogin, ssoLogin, sendOTP, verifyOTP, logout, forgotPassword, verifyResetCode, resetPassword, refreshToken } from '../../controllers/auth.controller';
import { changePassword, enable2FA, verify2FA, disable2FA, getSessions, revokeSession, revokeAllOtherSessions } from '../../controllers/auth.security.controller';
import { ensureUserAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

// Strict limiter for Login (max 5 attempts per 15 mins)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    const resetTime = (req as any).rateLimit?.resetTime;
    const remainingMs = resetTime ? resetTime.getTime() - Date.now() : 15 * 60 * 1000;
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    let timeString = '';
    if (minutes > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;

    res.status(429).json({
      type: 'https://api.example.com/errors/too-many-requests',
      title: 'Too Many Requests',
      status: 429,
      detail: `Too many login attempts, please try again in ${timeString.trim()}`
    });
  }
});

// Moderate limiter for Registration & OTP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { type: 'https://api.example.com/errors/too-many-requests', title: 'Too Many Requests', status: 429, detail: 'Too many requests, please try again later' }
});

router.post('/registrations', authLimiter, register);
router.post('/login', loginLimiter, userLogin);
router.post('/refresh', refreshToken);
router.post('/sessions/sso', loginLimiter, ssoLogin);
router.post('/logout', logout); // Do not strictly require auth middleware here if token might be expired, just clear cookie
router.post('/otp', authLimiter, sendOTP);
router.post('/otp/verifications', authLimiter, verifyOTP);

// Forgot Password (3-step SMS OTP flow)
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/forgot-password/verify', authLimiter, verifyResetCode);
router.post('/forgot-password/reset', authLimiter, resetPassword);

// Security & 2FA (Authenticated Flows)
router.put('/security/password', ensureUserAuthenticated, changePassword);
router.post('/security/2fa/enable', ensureUserAuthenticated, enable2FA);
router.post('/security/2fa/verify', ensureUserAuthenticated, verify2FA);
router.post('/security/2fa/disable', ensureUserAuthenticated, disable2FA);

// Session History Management
router.get('/security/sessions', ensureUserAuthenticated, getSessions);
router.delete('/security/sessions', ensureUserAuthenticated, revokeAllOtherSessions);
router.delete('/security/sessions/:id', ensureUserAuthenticated, revokeSession);

export default router;

