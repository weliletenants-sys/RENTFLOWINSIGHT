import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

/**
 * GET /api/funder/proxy/mandates
 * Authenticated pull of all active and revoked proxy limits
 */
export const getMandates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const mandates = await prisma.funderProxyMandates.findMany({
      where: { funder_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json({ status: 'success', data: { mandates } });
  } catch (error: any) {
    console.error('Error fetching mandates:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not fetch mandates', 'internal-error');
  }
};

/**
 * POST /api/funder/proxy/mandates
 * Secures a new daily transfer ceiling for a specific Agent ID
 */
export const addMandate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const { agent_code, daily_limit } = req.body;
    
    if (!agent_code || !daily_limit || daily_limit <= 0) {
      return problemResponse(res, 400, 'Bad Request', 'Agent tracking code and valid limit required.', 'validation-error');
    }

    // Verify Agent Code exists in real Profiles map (ignoring for mocked demo but structure is robust)
    
    // Deduplicate
    const existing = await prisma.funderProxyMandates.findFirst({
      where: { funder_id: userId, agent_code: agent_code.trim().toUpperCase() }
    });

    if (existing) {
      return problemResponse(res, 409, 'Conflict', 'Mandate already legally active for this Agent.', 'conflict');
    }

    const mandate = await prisma.funderProxyMandates.create({
      data: {
        funder_id: userId,
        agent_id: agent_code.trim().toUpperCase(), // Assume Agent ID/Code merges internally for MVP
        agent_code: agent_code.trim().toUpperCase(),
        agent_name: 'Verified Agent Profile', // Dummy fetch
        daily_limit: Number(daily_limit),
      }
    });

    return res.status(201).json({ status: 'success', message: 'Proxy Mandate legally secured.', data: { mandate } });
  } catch (error: any) {
    console.error('Error adding mandate:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not secure mandate', 'internal-error');
  }
};

/**
 * PUT /api/funder/proxy/mandates/:id/limit
 */
export const updateMandateLimit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { id } = req.params;
    const { daily_limit } = req.body;
    
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');
    if (!daily_limit || daily_limit <= 0) return problemResponse(res, 400, 'Bad Request', 'Invalid limit.', 'validation-error');

    const mandate = await prisma.funderProxyMandates.findFirst({ where: { id, funder_id: userId } });
    if (!mandate) return problemResponse(res, 404, 'Not Found', 'Mandate constraint not matched.', 'not-found');

    const updated = await prisma.funderProxyMandates.update({
      where: { id },
      data: { daily_limit: Number(daily_limit) }
    });

    return res.status(200).json({ status: 'success', message: 'Daily limit formally amended.', data: { mandate: updated } });
  } catch (error: any) {
    console.error('Error appending mandate limit:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not sync limit change', 'internal-error');
  }
};

/**
 * PUT /api/funder/proxy/mandates/:id/revoke
 */
export const revokeMandate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { id } = req.params;
    
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const mandate = await prisma.funderProxyMandates.findFirst({ where: { id, funder_id: userId } });
    if (!mandate) return problemResponse(res, 404, 'Not Found', 'Mandate constraint not matched.', 'not-found');

    await prisma.funderProxyMandates.update({
      where: { id },
      data: { status: 'revoked', revoked_at: new Date() }
    });

    return res.status(200).json({ status: 'success', message: 'Proxy wallet access permanently revoked.' });
  } catch (error: any) {
    console.error('Error revoking proxy mandate:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not freeze proxy link', 'internal-error');
  }
};

/**
 * PUT /api/funder/proxy/mandates/:id/restore
 */
export const restoreMandate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { id } = req.params;
    
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Session invalid', 'unauthorized');

    const mandate = await prisma.funderProxyMandates.findFirst({ where: { id, funder_id: userId } });
    if (!mandate) return problemResponse(res, 404, 'Not Found', 'Mandate constraint not matched.', 'not-found');

    await prisma.funderProxyMandates.update({
      where: { id },
      data: { status: 'active', revoked_at: null }
    });

    return res.status(200).json({ status: 'success', message: 'Agent formally reinstated to proxy limits.' });
  } catch (error: any) {
    console.error('Error reviving mandate:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not unfreeze proxy link', 'internal-error');
  }
};
