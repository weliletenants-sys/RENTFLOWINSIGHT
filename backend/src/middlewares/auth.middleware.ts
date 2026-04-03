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
  const authHeader = req.headers.authorization;
  let token = '';
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // DEVELOPMENT BYPASS
  if (token.startsWith('dummy-token-admin_') || token.startsWith('dummy-token_')) {
    const role = token.split('_')[1];
    req.user = { id: '999', role };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate session hasn't been revoked
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

export const rolesGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized: Role not found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
