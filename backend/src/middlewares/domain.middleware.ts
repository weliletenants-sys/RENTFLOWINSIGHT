import { Request, Response, NextFunction } from 'express';

// Extend express Request to include the context
declare global {
  namespace Express {
    interface Request {
      context?: 'admin' | 'user';
    }
  }
}

/**
 * Global middleware to detect request context based on host header
 */
export const domainContextDetector = (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host || '';
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  
  const adminAppUrl = process.env.ADMIN_APP_URL || 'http://admin.localhost:5173';
  const adminSessionDomain = process.env.ADMIN_SESSION_DOMAIN || 'admin.localhost';

  // Check if host matches the admin session domain, or if origin/referer originate from the admin app URL
  if (
    host.includes(adminSessionDomain) || 
    (origin && adminAppUrl.includes(origin)) || 
    (referer && referer.startsWith(adminAppUrl)) ||
    host.startsWith('admin.') || origin.includes('admin.') || referer.includes('admin.') // Fallback
  ) {
    req.context = 'admin';
  } else {
    req.context = 'user';
  }
  
  next();
};

/**
 * Enforces that the route is ONLY accessed from the admin domain.
 */
export const enforceAdminDomain = (req: Request, res: Response, next: NextFunction) => {
  if (req.context !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admin routes must be accessed via the admin domain.' });
  }
  next();
};

/**
 * Enforces that the route is ONLY accessed from the user domain (non-admin).
 */
export const enforceUserDomain = (req: Request, res: Response, next: NextFunction) => {
  if (req.context === 'admin') {
    return res.status(403).json({ message: 'Forbidden. User routes cannot be accessed via the admin domain.' });
  }
  next();
};
