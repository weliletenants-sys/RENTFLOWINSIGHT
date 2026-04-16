import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Lock file dynamically controls access without requiring an app restart
const MAINTENANCE_LOCK_FILE = path.join(process.cwd(), '.maintenance_lock');

/**
 * Strict Concurrency Freeze Enforcer
 * Drops all incoming API requests HTTP 503 natively if the system is under migration locking.
 */
export const maintenanceGatekeeper = (req: Request, res: Response, next: NextFunction) => {
    if (fs.existsSync(MAINTENANCE_LOCK_FILE)) {
        return res.status(503).json({
            success: false,
            error: 'service_unavailable',
            message: 'RENTFLOWINSIGHT is undergoing foundational financial infrastructure migrations. All transactions are structurally frozen. Our services will return shortly.',
            retry_after: 3600
        });
    }
    next();
};
