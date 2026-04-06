import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis.client';

export const requireIdempotency = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return res.status(400).json({ message: 'Idempotency-Key header is required for this operation.' });
    }

    const redis = getRedisClient();
    const redisKey = `idemp:req:${idempotencyKey}`;

    // Try to acquire the lock using SETNX (Set if Not eXists)
    const acquired = await redis.setnx(redisKey, 'PROCESSING');
    
    if (acquired === 1) {
      // Set TTL to 24 hours to prevent memory leaks in Redis
      await redis.expire(redisKey, 86400);

      // Hook into res.json to save the response on success
      const originalJson = res.json;
      
      res.json = function (body) {
        // Only cache the response if it was a success (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
           redis.setex(redisKey, 86400, JSON.stringify({
               status: 'COMPLETED',
               body,
               statusCode: res.statusCode
           })).catch(err => console.error('Failed to cache idempotency payload:', err));
        } else {
           // If the transaction failed natively, delete the lock so the user can naturally retry
           redis.del(redisKey).catch(err => console.error('Failed to clear idempotency lock on error:', err));
        }
        
        return originalJson.call(this, body);
      };

      next();
    } else {
      // Key already exists. Check if it's currently processing or already cached.
      const cachedResponse = await redis.get(redisKey);
      
      if (cachedResponse === 'PROCESSING') {
        return res.status(409).json({ message: 'A request with this Idempotency-Key is currently being processed. Please wait.' });
      }

      // If it exists but is not 'PROCESSING', it means it completed successfully before.
      try {
         const { status, body, statusCode } = JSON.parse(cachedResponse!);
         if (status === 'COMPLETED') {
             // Replay the exact cached success response to satisfy the frontend gracefully
             return res.status(statusCode).json(body);
         }
      } catch(e) {
          console.error("Failed to parse idempotency cache:", e);
      }

      return res.status(409).json({ message: 'Duplicate request detected and blocked.' });
    }
  };
};
