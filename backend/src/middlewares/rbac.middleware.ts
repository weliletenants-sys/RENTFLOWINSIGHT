import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

interface AuthorizeParams {
    roles?: string[];
    scopes?: string[];
}

// Basic in-memory fast TTL Cache
const roleCache = new Map<string, { role: string, scopes: string[], expires: number }>();
const CACHE_TTL_MS = 60000; // 1 minute resolution caching before DB fallback

export const authorize = ({ roles = [], scopes = [] }: AuthorizeParams) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // 1. Must be authenticated first
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: Missing Identity' });
        }

        // 2. Explicitly bypass caching during development conditionally or lookup cache
        const now = Date.now();
        let permissionsData = roleCache.get(userId);

        if (!permissionsData || permissionsData.expires < now) {
            // Cache Miss -> Pull from physical Truth
            const dbUser = await prisma.profiles.findUnique({
                where: { id: userId },
            });

            if (!dbUser || !dbUser.role) {
                return res.status(403).json({ error: 'Forbidden: No Role Bound in Database' });
            }

            const dbRole = dbUser.role.toUpperCase();

            // Resolve physical scopes from DB Join
            const rolePerms = await prisma.rolePermissions.findMany({
                where: { role: { name: dbRole } },
                include: { permission: true }
            });

            const resolvedScopes = rolePerms.map(rp => rp.permission.system_name || rp.permission.action);

            // Populate Fast-Cache
            permissionsData = {
                role: dbRole,
                scopes: resolvedScopes,
                expires: now + CACHE_TTL_MS
            };
            roleCache.set(userId, permissionsData);
        }

        const { role, scopes: userScopes } = permissionsData;

        // 3. Evaluate Role Match (If roles array provided, must match exactly one)
        if (roles.length > 0) {
            if (!roles.includes(role) && role !== 'SUPER_ADMIN') {
                return res.status(403).json({ 
                    error: `Forbidden: Restricted to roles [${roles.join(',')}]` 
                });
            }
        }

        // 4. Evaluate Scope Match (If scopes required, user must have ALL enumerated scopes)
        if (scopes.length > 0 && role !== 'SUPER_ADMIN') {
            const missingScopes = scopes.filter(s => !userScopes.includes(s));
            if (missingScopes.length > 0) {
                return res.status(403).json({ 
                    error: `Forbidden: Missing required scopes [${missingScopes.join(',')}]` 
                });
            }
        }

        // Apply back to req.user for downstream use cases
        req.user = { id: userId, role, scopes: userScopes };

        next();
    };
};

