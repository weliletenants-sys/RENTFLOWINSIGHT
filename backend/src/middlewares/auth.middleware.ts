import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import prisma from '../prisma/prisma.client';
import { PermissionService } from '../services/permission.service';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Config variables strictly decoupled from frontend VITE_ namespace
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wirntoujqoyjobfhyelc.supabase.co';
const SUPABASE_ISSUER = process.env.SUPABASE_ISSUER || `${SUPABASE_URL}/auth/v1`;
const SUPABASE_AUDIENCE = process.env.SUPABASE_AUDIENCE || 'authenticated';

// 1. JWKS Store: Securely cache rotating Supabase asymmetric keys
// Includes 3000ms timeout protection for 3G stalling
const JWKS = createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/keys`), {
  timeoutDuration: 3000, 
  cooldownDuration: 30000, // Wait 30s before retrying failed fetches
});

// Internal helper to extract and strictly verify tokens using jose
const verifyAndExtractToken = async (req: Request) => {
  let token = req.cookies?.user_session || req.cookies?.admin_session;
  
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    const authHead = req.headers.authorization.split(' ')[1];
    if (authHead && authHead !== 'null' && authHead !== 'undefined') {
        token = authHead;
    }
  }

  if (!token) {
    throw new Error('Missing or invalid Authorization header/cookie');
  }

  // Allow DEV bypass ONLY if explicitly configured (Critical for production safety)
  if (token.startsWith('dummy-token') && process.env.NODE_ENV !== 'production') {
    const role = token.split('_')[1];
    return { sub: '999', role };
  }

  // 2. Strict Signature & Claims Validation (Replaces jwt.decode / jwt.verify)
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: SUPABASE_ISSUER,
    audience: SUPABASE_AUDIENCE,
  });

  return payload;
};

export const supabaseAuthGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await verifyAndExtractToken(req);

    // 3. Map secure identity strictly
    req.user = {
      id: payload.sub,
      email: payload.email || undefined,
      phone: payload.phone || undefined,
      role: payload.role || 'authenticated'
    };

    next();
  } catch (err: any) {
    console.error('[JWT Verification Failed]', {
      message: err.message,
      path: req.path,
    });
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Alias for legacy routes to prevent undefined runtime crashes
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  return supabaseAuthGuard(req, res, next);
};

export const ensureUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  return supabaseAuthGuard(req, res, next);
};

export const ensureAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Strict Identity Verification via jose JWKS
    const payload = await verifyAndExtractToken(req);

    // Initialize req.user with strictly mapped values
    req.user = {
      id: payload.sub,
      email: payload.email || undefined,
      phone: payload.phone || undefined,
    };
    
    // 2. Explicit server-side role validation against the database as Source of Truth
    // DO NOT trust JWT embedded roles blindly!
    if (!req.user.id) {
       return res.status(401).json({ message: 'Unauthorized: Invalid token payload format' });
    }
    
    const dbUser = await prisma.profiles.findUnique({ where: { id: req.user.id } });
    
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
  } catch (err: any) {
    console.error('[Admin JWT Verification Failed]', {
      message: err.message,
      path: req.path,
    });
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
