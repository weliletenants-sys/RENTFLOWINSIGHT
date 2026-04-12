import { Request, Response, NextFunction } from 'express';
import { problemResponse } from '../utils/problem';
import logger from '../utils/logger';

/**
 * Universal error handler middleware to catch all unhandled exceptions
 * and convert them into RFC 7807 problem details.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Unhandled Error:', err);

  // If it's already a well-formed exception with status (like standard HTTP exceptions)
  if (err.status) {
    problemResponse(
      res,
      err.status,
      err.name || 'Error',
      err.message,
      'http-exception'
    );
    return;
  }

  // Handle Prisma ORM explicit errors
  if (err.code && err.code.startsWith('P2')) {
    problemResponse(
      res,
      400,
      'Database Error',
      'The requested operation violated a database constraint.',
      'database-exception'
    );
    return;
  }

  // Default server error
  problemResponse(
    res,
    500,
    'Internal Server Error',
    'An unexpected error occurred processing your request.',
    'internal-error'
  );
};
