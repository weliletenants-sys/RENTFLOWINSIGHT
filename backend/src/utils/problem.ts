import { Response } from 'express';

export const problemResponse = (res: Response, status: number, title: string, detail: string, type: string) => {
  return res.status(status).contentType('application/problem+json').json({
    type: `https://api.welile.com/errors/${type}`,
    title,
    status,
    detail,
    instance: `/errors/${type}`
  });
};
