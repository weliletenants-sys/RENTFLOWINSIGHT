import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithTrace extends Request {
  requestId?: string;
}

export function attachRequestId(req: RequestWithTrace, res: Response, next: NextFunction) {
  req.requestId = uuidv4();
  res.setHeader('x-request-id', req.requestId);

  // Extend the default send behavior implicitly logging success status traces
  const oldSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 500) {
        console.error(`[TRACE: ${req.requestId}] [${req.method}] ${req.originalUrl} - FAILED (${res.statusCode})`);
    } else {
        console.log(`[TRACE: ${req.requestId}] [${req.method}] ${req.originalUrl} - COMPLETED (${res.statusCode})`);
    }
    return oldSend.apply(res, arguments as any);
  };

  next();
}
