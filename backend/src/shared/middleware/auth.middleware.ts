import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_only';

/**
 * Validates the Native Node JWT from the Authorization header seamlessly without Supabase
 */
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Attach deeply decoded payload to Express Request for Controller usage
    (req as any).user = {
      id: decoded.sub || decoded.id,
      role: decoded.role,
      phone: decoded.phone
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is expired or invalid' });
  }
};

/**
 * High-Order Function extracting and enforcing Role boundaries utilizing the Native JWT
 */
export const rolesGuard = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ error: `Forbidden: This route requires one of the following roles: ${allowedRoles.join(', ')}` });
      return;
    }
    
    next();
  };
};
