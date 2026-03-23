import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';

// Extend express Request to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  // DEVELOPMENT BYPASS: Skip JWT verification completely and mock active identity
  req.user = { id: 'dev-bypass-id', role: 'SUPER_ADMIN', email: 'dev@welile.com' };
  return next();

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const session = await prisma.sessions.findUnique({ where: { token } });
    if (!session || session.is_revoked) {
      return res.status(401).json({ message: 'Unauthorized: Session ended or revoked' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const rolesGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // DEVELOPMENT BYPASS: Automatically clear all RBAC boundary scopes
    return next();

    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized: Role not found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
