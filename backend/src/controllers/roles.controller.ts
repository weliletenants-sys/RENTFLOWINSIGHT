import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// All available roles in the platform
const AVAILABLE_ROLES = ['FUNDER', 'LANDLORD', 'TENANT', 'AGENT'] as const;

/**
 * GET /roles/my-roles
 * Returns all roles for the authenticated user, plus available roles they can request.
 */
export const getMyRoles = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const activeRole = req.user.role;

    const [userRoles, userPersonas] = await Promise.all([
      prisma.userRoles.findMany({ where: { user_id: userId } }),
      prisma.userPersonas.findMany({ where: { user_id: userId } })
    ]);

    // Build a combined view: all platform roles with status
    const rolesView = AVAILABLE_ROLES.map(role => {
      // Naturally active via the current session payload
      if (role === activeRole) return { role, status: 'ACTIVE', assignedAt: null };
      
      // Naturally active via a verified persona
      const hasPersona = userPersonas.some(p => p.persona.toUpperCase() === role);
      if (hasPersona) return { role, status: 'ACTIVE', assignedAt: null };

      // Fallback to explicit role requests
      const existing = userRoles.find(r => r.role === role);
      return {
        role,
        status: existing
          ? (existing.enabled ? 'ACTIVE' : 'PENDING')
          : 'AVAILABLE',
        assignedAt: existing?.created_at || null
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Roles fetched successfully',
      data: {
        activeRole,
        roles: rolesView
      }
    });
  } catch (error) {
    console.error('getMyRoles error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

/**
 * POST /roles/request
 * Body: { role: 'LANDLORD' | 'TENANT' | 'AGENT' | 'FUNDER' }
 * Creates and instantly approves a role request (enabled: true) for testing Multi-Role Flow.
 */
export const requestRole = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const { role } = req.body;

    if (!role || !AVAILABLE_ROLES.includes(role)) {
      return problemResponse(res, 400, 'Validation Error', `Invalid role. Must be one of: ${AVAILABLE_ROLES.join(', ')}`, 'validation-error');
    }

    // Check if natively attached via Personas
    const userPersona = await prisma.userPersonas.findFirst({
      where: { user_id: userId, persona: { equals: role, mode: 'insensitive' } }
    });
    if (userPersona || req.user.role === role) {
      return problemResponse(res, 409, 'Conflict', `You already natively hold the ${role} role.`, 'conflict');
    }

    // Check explicit requests
    const existing = await prisma.userRoles.findFirst({
      where: { user_id: userId, role }
    });

    if (existing && existing.enabled) {
      return problemResponse(res, 409, 'Conflict', `You already have the ${role} role active.`, 'conflict');
    }

    if (existing && !existing.enabled) {
      return problemResponse(res, 409, 'Conflict', `Your ${role} role request is already pending approval.`, 'conflict');
    }

    const now = new Date().toISOString();

    await prisma.userRoles.create({
      data: {
        user_id: userId,
        role,
        enabled: true, // auto-approve activated
        created_at: now
      }
    });

    return res.status(201).json({
      status: 'success',
      message: `${role} role activated successfully. It is now available in your sidebar.`,
      data: {}
    });
  } catch (error) {
    console.error('requestRole error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

/**
 * POST /roles/switch
 * Body: { role: 'LANDLORD' | 'TENANT' | 'AGENT' | 'FUNDER' }
 * Issues a new JWT with the switched role (only if the role is active/enabled).
 */
export const switchRole = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const { role } = req.body;

    if (!role || !AVAILABLE_ROLES.includes(role)) {
      return problemResponse(res, 400, 'Validation Error', `Invalid role. Must be one of: ${AVAILABLE_ROLES.join(', ')}`, 'validation-error');
    }

    if (role === req.user.role) {
      return problemResponse(res, 400, 'Validation Error', `You are already logged into the ${role} role.`, 'validation-error');
    }

    // Check if user has this role via Personas or explicit Role Requests
    const [userPersona, explicitRole] = await Promise.all([
      prisma.userPersonas.findFirst({ where: { user_id: userId, persona: { equals: role, mode: 'insensitive' } } }),
      prisma.userRoles.findFirst({ where: { user_id: userId, role, enabled: true } })
    ]);

    if (!userPersona && !explicitRole) {
      return problemResponse(res, 403, 'Forbidden', `You do not have an active ${role} role.`, 'forbidden');
    }

    // Fetch user profile for the new token
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) {
      return problemResponse(res, 404, 'Not Found', `Profile not found`, 'not-found');
    }

    // Issue new JWT with the switched role
    const payload = { email: profile.email, sub: profile.id, role, firstName: profile.full_name?.split(' ')[0] || 'User' };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Revoke old session to strictly enforce security guidelines
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const oldToken = authHeader.split(' ')[1];
      await prisma.sessions.updateMany({
        where: { token: oldToken },
        data: { expires_at: new Date() }
      });
    }

    // Create a new session record for the new token
    await prisma.sessions.create({
      data: {
        user_id: profile.id,
        token: access_token,
        device_info: req.headers['user-agent']?.substring(0, 255) || null,
        ip_address: req.ip?.substring(0, 45) || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    return res.status(200).json({
      status: 'success',
      message: `Switched to ${role} role successfully`,
      data: {
        access_token,
        user: {
          id: profile.id,
          email: profile.email,
          firstName: profile.full_name?.split(' ')[0] || 'User',
          lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
          role
        }
      }
    });
  } catch (error) {
    console.error('switchRole error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};
