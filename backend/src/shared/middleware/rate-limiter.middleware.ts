import rateLimit from 'express-rate-limit';

// Strict throttling mechanism defending monetary mutations from brute-forcing, spam, or broken loops.
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Max 10 requests per window natively
  message: {
      error: 'Too Many Requests',
      detail: 'This endpoint is strictly rate limited to protect transaction concurrency bounds. Please wait a minute before retrying.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
