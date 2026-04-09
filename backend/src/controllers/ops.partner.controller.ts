import { Request, Response } from 'express';
import { problemResponse } from '../utils/problem';

export const getPartnerOpsOverview = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      metrics: {
        proxyApprovals: 3,
        angelPoolStatus: 'active',
        roiRunsScheduled: 5
      }
    });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch partner operations overview.', 'server-error');
  }
};

export const approveProxyInvestment = async (req: Request, res: Response) => {
  try {
    const { investmentId, action } = req.body;
    if (!investmentId || !action) return res.status(400).json({ error: 'Bad Request' });

    res.json({ status: 'ok', message: `Proxy investment ${action}` });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to process proxy investment.', 'server-error');
  }
};
