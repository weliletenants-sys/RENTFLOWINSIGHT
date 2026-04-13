import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { problemResponse } from '../utils/problem';

/**
 * Middleware to validate incoming request data (body, query, params) against a Zod schema.
 * Formats errors strictly following RFC 7807 Problem Details.
 */
export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map zod issues into a readable string details format
        const detail = error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ');

        return problemResponse(
          res,
          400,
          'Validation Error',
          `Input validation failed: ${detail}`,
          'validation-error'
        );
      }
      next(error);
    }
  };
};
