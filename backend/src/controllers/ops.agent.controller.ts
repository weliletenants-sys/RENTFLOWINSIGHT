import { Request, Response } from 'express';
import { problemResponse } from '../utils/problem';

export const getAgentOpsOverview = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      metrics: {
        criticalFloats: 4,
        pendingAdvances: 5,
        activeAgents: 120
      }
    });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch agent operations overview.', 'server-error');
  }
};

export const adjustAgentFloatLimit = async (req: Request, res: Response) => {
  try {
    const { agentId, newLimit } = req.body;
    if (!agentId || !newLimit) return res.status(400).json({ error: 'Bad Request' });

    res.json({ status: 'ok', message: 'Float limit adjusted' });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to adjust float limit', 'server-error');
  }
};
