import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const AVAILABLE_PERSONAS = ['tenant', 'funder', 'agent', 'landlord', 'admin'] as const;

/**
 * GET /api/v1/personas
 * Returns all approved personas for this user, plus the active token role.
 */
export const getUserPersonas = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;

    const personas = await prisma.userPersonas.findMany({
      where: { user_id: userId }
    });

    const activePersona = req.user.role; // The current JWT mode string

    return res.status(200).json({
      activePersona,
      personas: personas.map(p => ({
        persona: p.persona,
        isDefault: p.is_default,
        grantedAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('getUserPersonas error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch user personas', 'urn:rentflow:error:internal');
  }
};

/**
 * POST /api/v1/personas/requisitions
 * Body: { requestedPersona: string, justification: string }
 * Apply for a completely new mode to be unlocked.
 */
export const createPersonaRequisition = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const { requestedPersona, justification } = req.body;

    if (!requestedPersona || !AVAILABLE_PERSONAS.includes(requestedPersona)) {
      return problemResponse(res, 400, 'Validation Error', `Invalid persona. Must be one of: ${AVAILABLE_PERSONAS.join(', ')}`, 'urn:rentflow:error:validation');
    }

    // Check if they already have this persona
    const existingPersona = await prisma.userPersonas.findFirst({
      where: { user_id: userId, persona: requestedPersona }
    });

    if (existingPersona) {
      return problemResponse(res, 409, 'Conflict', `You already possess the ${requestedPersona} persona natively.`, 'urn:rentflow:error:conflict');
    }

    // Check if they already filed an open requisition
    const pendingReq = await prisma.personaRequisitions.findFirst({
      where: { user_id: userId, requested_persona: requestedPersona, status: 'pending' }
    });

    if (pendingReq) {
      return problemResponse(res, 409, 'Conflict', `You already have a pending requisition for the ${requestedPersona} persona.`, 'urn:rentflow:error:conflict');
    }

    const requisition = await prisma.personaRequisitions.create({
      data: {
        user_id: userId,
        requested_persona: requestedPersona,
        justification: justification || null,
        status: 'pending'
      }
    });

    return res.status(201).json({
      message: `${requestedPersona} persona requested successfully. Awaiting CRM/Manager approval.`,
      requisitionId: requisition.id
    });
  } catch (error) {
    console.error('createPersonaRequisition error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Internal server error', 'urn:rentflow:error:internal');
  }
};

/**
 * GET /api/v1/personas/requisitions
 * Returns all of the current user's past and pending applications.
 */
export const getUserRequisitions = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;

    const reqs = await prisma.personaRequisitions.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json(reqs);
  } catch (error) {
    console.error('getUserRequisitions error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Internal server error', 'urn:rentflow:error:internal');
  }
};

/**
 * POST /api/v1/personas/switch
 * Body: { targetPersona: string }
 * Swap active mode and get a new token.
 */
export const switchPersonaMode = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const { targetPersona } = req.body;

    const personaAuth = await prisma.userPersonas.findFirst({
      where: { user_id: userId, persona: targetPersona }
    });

    if (!personaAuth) {
      return problemResponse(res, 403, 'Forbidden', `You do not have clearance for the ${targetPersona} persona. Submit a requisition first.`, 'urn:rentflow:error:forbidden');
    }

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) throw new Error('Profile missing');

    const payload = { email: profile.email, sub: profile.id, role: targetPersona };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      access_token,
      mode: targetPersona,
      message: `Successfully swapped context to ${targetPersona} Mode.`
    });
  } catch (error) {
    console.error('switchPersonaMode error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Internal server error', 'urn:rentflow:error:internal');
  }
};
