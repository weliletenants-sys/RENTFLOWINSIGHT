import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';
import { PermissionService } from '../services/permission.service';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Alias for legacy routes to prevent undefined runtime crashes
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  return ensureUserAuthenticated(req, res, next);
};

export const ensureUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.user_session;
  
  // Fallback map legacy headers only if they are strictly not null strings
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    const authHead = req.headers.authorization.split(' ')[1];
    if (authHead && authHead !== 'null' && authHead !== 'undefined') {
        token = authHead;
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No user session found' });
  }

  // DEVELOPMENT BYPASS
  if (token.startsWith('dummy-token_')) {
    const role = token.split('_')[1];
    req.user = { id: '999', role };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await prisma.sessions.findUnique({ where: { token } });
    if (session && session.is_revoked) {
      return res.status(401).json({ message: 'Unauthorized: Session revoked' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const ensureAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.admin_session;
  
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    const authHead = req.headers.authorization.split(' ')[1];
    if (authHead && authHead !== 'null' && authHead !== 'undefined') {
        token = authHead;
    }
  }
  
  if (!token) {
    // DO NOT REDIRECT, return 401. The domain Guard React component handles redirection.
    return res.status(401).json({ message: 'Unauthorized: No admin session found' });
  }

  // DEVELOPMENT BYPASS
  if (token.startsWith('dummy-token-admin_')) {
    const role = token.split('_')[1];
    req.user = { id: '999', role };
    return next();
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const session = await prisma.sessions.findUnique({ where: { token } });
    if (session && session.is_revoked) {
      return res.status(401).json({ message: 'Unauthorized: Session revoked' });
    }

    req.user = decoded;
    
    // Explicit server-side role validation against the database as Source of Truth
    const userId = req.user.id || req.user.sub || req.user.userId;
    
    if (!userId) {
       return res.status(401).json({ message: 'Unauthorized: Invalid token payload format' });
    }
    
    const dbUser = await prisma.profiles.findUnique({ where: { id: userId } });
    
    if (!dbUser || !dbUser.role) {
       return res.status(403).json({ message: 'Forbidden: Unauthorized payload in Database.' });
    }
    
    // Evaluate Dynamic Spatie RBAC Permissions
    if (dbUser.role !== 'SUPER_ADMIN') {
       const hasAdminAccess = await PermissionService.hasPermission(dbUser.role, 'admin-dashboard');
       if (!hasAdminAccess) {
          return res.status(403).json({ message: 'Forbidden: Role lacks [admin-dashboard] system-level permission.' });
       }
    }
    
    // Enforce the live DB role into the pipeline to prevent executing on stale JWT data
    req.user.role = dbUser.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid admin token' });
  }
};

export const rolesGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized: Role not found' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
    }
    next();
  };
};

export const ensurePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !req.user.sub) {
      return res.status(401).json({ message: 'Unauthorized: Missing user identity' });
    }

    const { role } = req.user;
    
    // Super admins always bypass
    if (role === 'SUPER_ADMIN') return next();

    try {
      const hasPermission = await PermissionService.hasPermission(role, requiredPermission);
      if (!hasPermission) {
        return res.status(403).json({ message: `Forbidden: Missing required permission [${requiredPermission}]` });
      }
      next();
    } catch (error) {
      console.error('Permission resolution failed:', error);
      return res.status(500).json({ message: 'Internal Server Error evaluating permissions' });
    }
  };
};
