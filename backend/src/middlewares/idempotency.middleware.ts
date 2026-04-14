import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma.client';
import logger from '../utils/logger';

export const requireIdempotency = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const idempotencyKey = req.headers['x-idempotency-key'] || req.headers['idempotency-key'];

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return res.status(400).json({ 
        title: 'Missing Idempotency Key',
        detail: 'The X-Idempotency-Key header is strictly required for this mutating operation to prevent duplicates.'
      });
    }

    try {
      // 1. Check if key exists
      const existingRecord = await prisma.idempotencyKeys.findUnique({
        where: { key: idempotencyKey }
      });

      if (existingRecord) {
        if (existingRecord.status === 'completed') {
          logger.info(`[Idempotency] Replaying cached response for key: ${idempotencyKey}`);
          return res.status(200).json(existingRecord.response);
        } else if (existingRecord.status === 'processing') {
          return res.status(409).json({
            title: 'Conflict',
            detail: 'A request with this Idempotency-Key is currently being processed. Please wait.'
          });
        } else {
           // If error status, allow a retry by falling through
           logger.warn(`[Idempotency] Previous attempt failed for key: ${idempotencyKey}. Permitting retry.`);
        }
      } else {
        // Create the processing lock
        await prisma.idempotencyKeys.create({
          data: { key: idempotencyKey, status: 'processing' }
        });
      }

      // 2. Hook into res.json to capture response on success
      const originalJson = res.json;
      
      res.json = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Success: finalize the idempotency record
          prisma.idempotencyKeys.update({
             where: { key: idempotencyKey },
             data: { status: 'completed', response: body as any }
          }).catch(err => logger.error(`[Idempotency] Failed to cache final response:`, err));
        } else {
          // Failure: we either mark it as error or delete so the user can easily retry
          prisma.idempotencyKeys.update({
             where: { key: idempotencyKey },
             data: { status: 'error' }
          }).catch(err => logger.error(`[Idempotency] Failed to mark error status:`, err));
        }

        return originalJson.call(this, body);
      };

      next();

    } catch (error) {
      logger.error('[Idempotency Middleware] Fatal Error:', error);
      next(error);
    }
  };
};
