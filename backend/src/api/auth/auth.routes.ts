import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, sendOTP, verifyOTP } from '../../controllers/auth.controller';

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

router.post('/register', authLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/otp/send', authLimiter, sendOTP);
router.post('/otp/verify', authLimiter, verifyOTP);

export default router;
