import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';
// Prisma types were regenerated


// Helper to log to audit_logs
const logAudit = async (actor_id: string, actor_role: string, action_type: string, target_id: string, metadata: any, req: Request) => {
  try {
    const ip_address = req.ip || req.connection.remoteAddress || '';
    const user_agent = req.headers['user-agent'] || '';
    
    await prisma.auditLogs.create({
      data: {
        user_id: actor_id,
        actor_role,
        action_type,
        target_id,
        metadata,
        ip_address,
        user_agent,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.profiles.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        is_frozen: true
      }
    });

    const mappedUsers = users.map(u => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      phone: u.phone,
      role: u.role || 'TENANT',
      status: u.is_frozen ? 'Frozen' : 'Active'
    }));

    return res.status(200).json(mappedUsers);
  } catch (error) {
    console.error('Failed to get users:', error);
    return problemResponse(res, 500, 'Error', 'Failed to fetch users', 'urn:error:internal');
  }
};

export const assignRole = async (req: Request, res: Response) => {
  try {
    const actorId = req.user?.sub;
    const { targetUserId, newRole, mfaToken } = req.body;
    
    if (!mfaToken) return problemResponse(res, 401, 'Unauthorized', 'MFA required for role assignment', 'urn:error:mfa-required');
    if (newRole === 'SUPER_ADMIN') return problemResponse(res, 403, 'Forbidden', 'Cannot assign SUPER_ADMIN role', 'urn:error:forbidden');

    // Assign role
    await prisma.userRoles.create({
      data: {
        user_id: targetUserId,
        role: newRole,
        enabled: true,
        created_at: new Date().toISOString()
      }
    });

    await logAudit(actorId, 'SUPER_ADMIN', 'ASSIGN_ROLE', targetUserId, { newRole }, req);

    return res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to assign role', 'urn:error:internal');
  }
};

export const freezeAccount = async (req: Request, res: Response) => {
  try {
    const actorId = req.user?.sub;
    const { targetUserId, reason } = req.body;

    await prisma.profiles.update({
      where: { id: targetUserId },
      data: {
        is_frozen: true,
        frozen_at: new Date().toISOString(),
        frozen_reason: reason || 'Frozen by Super Admin'
      }
    });

    await logAudit(actorId, 'SUPER_ADMIN', 'FREEZE_ACCOUNT', targetUserId, { reason }, req);

    return res.status(200).json({ message: 'Account frozen' });
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to freeze account', 'urn:error:internal');
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const actorId = req.user?.sub;
    const { targetUserId, hardDelete, mfaToken } = req.body;

    if (!mfaToken) return problemResponse(res, 401, 'Unauthorized', 'MFA required for deletion', 'urn:error:mfa-required');

    if (hardDelete) {
      // Logic for hard delete (delayed execution concept, maybe just queue it or actually delete)
      await prisma.profiles.delete({ where: { id: targetUserId } });
      await logAudit(actorId, 'SUPER_ADMIN', 'HARD_DELETE_ACCOUNT', targetUserId, {}, req);
    } else {
      // Soft delete -> scramble data
      await prisma.profiles.update({
        where: { id: targetUserId },
        data: {
          email: `${targetUserId}@deleted.welile.com`,
          phone: `DEL_${targetUserId}`,
          is_frozen: true,
          frozen_reason: 'Soft Deleted'
        }
      });
      await logAudit(actorId, 'SUPER_ADMIN', 'SOFT_DELETE_ACCOUNT', targetUserId, {}, req);
    }

    return res.status(200).json({ message: 'Account deletion processed' });
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to delete account', 'urn:error:internal');
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, actionType, actorRole, targetUserId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (actionType) where.action_type = String(actionType);
    if (actorRole) where.actor_role = String(actorRole);
    if (targetUserId) where.target_id = String(targetUserId);

    const logs = await prisma.auditLogs.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.auditLogs.count({ where });

    return res.status(200).json({ data: logs, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to fetch audit logs', 'urn:error:internal');
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await prisma.systemConfigs.findFirst({
      orderBy: { version: 'desc' }
    });

    return res.status(200).json(config || { config_data: {} });
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to fetch config', 'urn:error:internal');
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const actorId = req.user?.sub;
    const { configData, mfaToken } = req.body;

    if (!mfaToken) return problemResponse(res, 401, 'Unauthorized', 'MFA required to change config', 'urn:error:mfa-required');

    const lastConfig = await prisma.systemConfigs.findFirst({
      orderBy: { version: 'desc' }
    });
    
    const nextVersion = lastConfig ? lastConfig.version + 1 : 1;

    const newConfig = await prisma.systemConfigs.create({
      data: {
        version: nextVersion,
        config_data: configData,
        changed_by: actorId
      }
    });

    await logAudit(actorId, 'SUPER_ADMIN', 'UPDATE_CONFIG', newConfig.id, { version: nextVersion }, req);

    return res.status(200).json(newConfig);
  } catch (error) {
    return problemResponse(res, 500, 'Error', 'Failed to update config', 'urn:error:internal');
  }
};
