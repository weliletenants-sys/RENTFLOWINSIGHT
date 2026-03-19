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

    const userRoles = await prisma.userRoles.findMany({
      where: { user_id: userId }
    });

    // Build a combined view: all platform roles with status
    const rolesView = AVAILABLE_ROLES.map(role => {
      const existing = userRoles.find(r => r.role === role);
      return {
        role,
        status: existing
          ? (existing.enabled ? 'ACTIVE' : 'PENDING')
          : 'AVAILABLE',
        assignedAt: existing?.created_at || null
      };
    });

    // Determine the current active role from JWT
    const activeRole = req.user.role;

    return res.status(200).json({
      activeRole,
      roles: rolesView
    });
  } catch (error) {
    console.error('getMyRoles error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

/**
 * POST /roles/request
 * Body: { role: 'LANDLORD' | 'TENANT' | 'AGENT' | 'FUNDER' }
 * Creates a pending role request (enabled: false) for admin approval.
 */
export const requestRole = async (req: Request, res: Response) => {
  try {
    const userId = req.user.sub;
    const { role } = req.body;

    if (!role || !AVAILABLE_ROLES.includes(role)) {
      return problemResponse(res, 400, 'Validation Error', `Invalid role. Must be one of: ${AVAILABLE_ROLES.join(', ')}`, 'validation-error');
    }

    // Check if user already has this role (active or pending)
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
        enabled: false,
        created_at: now
      }
    });

    return problemResponse(res, 201, 'Error', `${role} role requested successfully. Awaiting admin approval.`, 'error');
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

    // Check if user has this role enabled
    const userRole = await prisma.userRoles.findFirst({
      where: { user_id: userId, role, enabled: true }
    });

    if (!userRole) {
      return problemResponse(res, 403, 'Forbidden', `You do not have an active ${role} role.`, 'forbidden');
    }

    // Fetch user profile for the new token
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) {
      return problemResponse(res, 404, 'Not Found', `Profile not found`, 'not-found');
    }

    // Issue new JWT with the switched role
    const payload = { email: profile.email, sub: profile.id, role };
    const access_token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).json({
      access_token,
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role
      }
    });
  } catch (error) {
    console.error('switchRole error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};
