import { Response } from 'express';

export interface SuccessResponse<T = any> {
  status: 'success';
  message: string;
  data: T;
  requestId?: string;
}

export interface ErrorResponse {
  status: 'error';
  error: string;
  code?: string;
  requestId?: string;
}

/**
 * Standardizes successful API responses natively.
 */
export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const payload: SuccessResponse = {
    status: 'success',
    message,
    data,
    requestId: res.getHeader('x-request-id') as string | undefined,
  };
  res.status(statusCode).json(payload);
};

/**
 * Standardizes failing API responses natively.
 */
export const sendError = (
  res: Response,
  error: string = 'Internal Server Error',
  statusCode: number = 500,
  code?: string
): void => {
  const payload: ErrorResponse = {
    status: 'error',
    error,
    code,
    requestId: res.getHeader('x-request-id') as string | undefined,
  };
  res.status(statusCode).json(payload);
};
