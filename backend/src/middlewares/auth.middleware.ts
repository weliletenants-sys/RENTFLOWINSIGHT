import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wirntoujqoyjobfhyelc.supabase.co';
const SUPABASE_ISSUER = process.env.SUPABASE_ISSUER || `${SUPABASE_URL}/auth/v1`;
const SUPABASE_AUDIENCE = process.env.SUPABASE_AUDIENCE || 'authenticated';
const JWKS_URI = `${SUPABASE_URL}/auth/v1/keys`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

console.log(`[AUTH-INIT] Configuring JWKS JWT Auth Pipeline`);
console.log(`[AUTH-INIT] Target JWKS URL: ${JWKS_URI}`);

// One-time boot probe
(async () => {
  try {
    const res = await fetch(JWKS_URI, { headers: { apikey: SUPABASE_ANON_KEY } });
    console.log(`[AUTH-INIT] JWKS fetch status: ${res.status} ${res.statusText}`);
  } catch (err: any) {
    console.error(`[AUTH-INIT] Failed to probe JWKS URL at boot:`, err.message);
  }
})();

const JWKS = createRemoteJWKSet(new URL(JWKS_URI), {
  timeoutDuration: 5000, 
  cooldownDuration: 30000,
  fetcher: async (url, options) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: { apikey: SUPABASE_ANON_KEY }
      });
      if (!res.ok) {
        console.error(`[AUTH] JWKS fetch failed with status ${res.status}`);
      }
      return res;
    } catch (err: any) {
      console.error(`[AUTH] Hard JWKS fetch crash:`, err.message);
      throw err;
    }
  }
});

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

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: SUPABASE_ISSUER,
    audience: SUPABASE_AUDIENCE,
  });

  return payload;
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
