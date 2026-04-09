import { Request, Response } from 'express';
import { problemResponse } from '../utils/problem';

export const getTenantOpsOverview = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      metrics: {
        pendingApprovals: 12,
        escalations: 3,
        activeTenants: 1050
      }
    });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch tenant operations overview.', 'server-error');
  }
};

export const manualCollectRent = async (req: Request, res: Response) => {
  try {
    const { tenantId, amount, reason } = req.body;
    if (!tenantId || !amount || !reason) return res.status(400).json({ error: 'Bad Request' });

    res.json({ status: 'ok', message: 'Manual collection logged' });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Manual collection error', 'server-error');
  }
};
