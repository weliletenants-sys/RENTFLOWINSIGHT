import { Response } from 'express';

export const problemResponse = (res: Response, status: number, title: string, detail: string, type: string) => {
  return res.status(status).json({
    type: 'about:blank',
    title,
    status,
    detail,
    instance: type
  });
};
