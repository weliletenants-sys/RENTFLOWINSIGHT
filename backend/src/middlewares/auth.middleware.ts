import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
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
    return { sub: '999' };
  }

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: SUPABASE_ISSUER,
    audience: SUPABASE_AUDIENCE,
  });

  return payload;
};

/**
 * Phase 3 Identity Layer: strictly extracts user ID from JWT. 
 * IT DOES NOT ASSIGN ROLES. NEVER TRUST JWT FOR PERMISSIONS.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await verifyAndExtractToken(req);

    // Identity Only. Let the DB decide the permissions.
    req.user = { id: payload.sub! };
    
    next();
  } catch (err: any) {
    console.error('[Identity Verification Failed]', { message: err.message, path: req.path });
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired identity token' });
  }
};

// Aliases mapped temporarily strictly to identity decoder to resolve current API imports seamlessly over phase 3 transitions
export const supabaseAuthGuard = authenticate;
export const ensureUserAuthenticated = authenticate;
export const ensureAdminAuthenticated = authenticate;

