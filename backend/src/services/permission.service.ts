import redisClient from '../config/redis.client';
import prisma from '../prisma/prisma.client';

export class PermissionService {
  /**
   * Evaluates if a role has a specific permission.
   * Utilizes Redis for sub-millisecond resolution, falling back to PostgreSQL.
   */
  static async hasPermission(role: string, requiredPermission: string): Promise<boolean> {
    const actor_type = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MANAGER' ? 'admin' : 'user';
    const cacheKey = `permissions:${actor_type}:role:${role}`; // Cache by role group exactly as designed
    
    const redis = redisClient();
    let cachedPermissions = await redis.get(cacheKey);

    if (!cachedPermissions) {
      // Fallback: Resolve from Source of Truth (Database)
      const rolePerms = await prisma.rolePermissions.findMany({
        where: { role: role.toUpperCase() },
        include: { permission: true }
      });
      
      const permissionsList = rolePerms.map(rp => rp.permission.name);
      
      // Cache for 1 hour
      await redis.setex(cacheKey, 3600, JSON.stringify(permissionsList));
      cachedPermissions = JSON.stringify(permissionsList);
    }

    const permissionsArray: string[] = JSON.parse(cachedPermissions);
    return permissionsArray.includes(requiredPermission);
  }

  /**
   * Instantly invalidates the cached permissions for a specific role or context.
   * Required for immediate revocation.
   */
  static async invalidatePermissions(role: string): Promise<void> {
    const actor_type = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MANAGER' ? 'admin' : 'user';
    const cacheKey = `permissions:${actor_type}:role:${role}`;
    const redis = redisClient();
    await redis.del(cacheKey);
  }
}

