import { Request, Response, NextFunction } from 'express';
import { defineAbilityFor, Actions, Subjects } from '../utils/casl.ability';
import { problemResponse } from '../utils/problem';

/**
 * Express middleware to enforce strictly Spatie-like CASL permissions.
 * Usage: router.get('/financial-ops', checkPermission('access', 'FinancialOps'), controller...)
 */
export const checkPermission = (action: Actions, subject: Subjects) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return problemResponse(res, 401, 'Unauthorized', 'Authentication required for this operation.', 'unauthorized');
      }

      const ability = await defineAbilityFor(userId);

      if (ability.can(action, subject)) {
        return next();
      }

      console.warn(`RBAC BLOCKED: User ${userId} attempted ${action} on ${String(subject)} without sufficient permissions.`);
      return problemResponse(
        res, 
        403, 
        'Forbidden', 
        `RoleGuard Restricted: Your current role lacks permission to '${action}' the '${String(subject)}' resource.`, 
        'forbidden'
      );
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      return problemResponse(res, 500, 'Internal Server Error', 'Failed to evaluate access permissions.', 'internal-server-error');
    }
  };
};
