import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// Strict throttling mechanism defending monetary mutations from brute-forcing, spam, or broken loops.
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Max 10 requests per window natively
  message: {
      status: 'error',
      error: 'Too Many Requests',
      detail: 'This endpoint is strictly rate limited to protect transaction concurrency bounds. Please wait a minute before retrying.'
  },
  keyGenerator: (req) => {
    // Generate context-aware keys locking abuse per specific user and endpoint context safely generating IPv6 identifiers
    const identifier = (req as any).user?.id || ipKeyGenerator(req);
    const idempotency = req.body?.idempotencyKey ? `_${req.body.idempotencyKey}` : '';
    return `${identifier}_${req.originalUrl}${idempotency}`;
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
