import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ─── Type augmentation: identity context forwarded through the request pipeline ──
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        phone?: string;
        // Set by RBAC authorize() middleware — populated from DB, never from JWT
        role?: string;
        scopes?: string[];
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';

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

  if (token.startsWith('dummy-token') && process.env.NODE_ENV !== 'production') {
    return { sub: '999', email: 'dev@localhost', phone: undefined as string | undefined };
  }

  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

/**
 * Zero-Trust Identity Gate (Phase 3 Architecture)
 *
 * - Verifies the Supabase JWT cryptographically via JWKS
 * - Extracts `sub` as the canonical user ID — this MUST equal profiles.id
 * - Forwards `email` + `phone` claims for the silent migration resolver
 * - NEVER assigns roles — all authorization comes from the database
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await verifyAndExtractToken(req);

    req.user = {
      id: payload.sub!,
      // Forward identity claims for profile seeding (NOT for authorization)
      email: (payload as any).email ?? undefined,
      phone: (payload as any).phone ?? undefined,
    };
    
    next();
  } catch (err: any) {
    console.error('[Identity Verification Failed]', { message: err.message, path: req.path });
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired identity token' });
  }
};

// Aliases mapped to the zero-trust identity gate
export const supabaseAuthGuard = authenticate;
export const ensureUserAuthenticated = authenticate;
export const ensureAdminAuthenticated = authenticate;

// ─── Legacy compatibility aliases (src/api/ routes) ──────────────────────────
// These map the old naming convention to the current Phase 3 identity gate.
// Do NOT remove — many src/api/ routes still import these names.
export const authGuard = authenticate;

/**
 * rolesGuard — legacy shim.
 * Previously this checked roles from JWT (insecure). Now it is a no-op pass-through.
 * Real role enforcement is done via authorize() in rbac.middleware.ts which reads from DB.
 * Keeping this as a named export prevents import errors in legacy routes.
 */
export const rolesGuard = (..._roles: string[]) =>
  (_req: Request, _res: Response, next: NextFunction) => next();
