import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs with importance level of `error` or less to `logs/error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `logs/combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write specific security events to a dedicated log
    new winston.transports.File({ filename: 'logs/security.log', level: 'info' }),
    // Also log to console for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Helper to log security events to both Winston (.log file) and Prisma DB
 */
import prisma from '../prisma/prisma.client';

export const logSecurityEvent = async (params: {
  event: string;
  user_id?: string; // Legacy compatibility
  email?: string;
  ip_address?: string;
  user_agent?: string;
  actor_id?: string;
  actor_type?: 'admin' | 'user' | string;
  action?: string;
  status?: 'success' | 'failure' | string;
  details?: any;
  timestamp?: string;
}) => {
  try {
    const detailsStr = params.details ? JSON.stringify(params.details) : null;
    
    // Unify actor_id with legacy user_id
    const finalUserId = params.actor_id || params.user_id;

    // 1. Log to physical file via Winston
    logger.info(`Security Event: ${params.event}`, {
      ...params,
      user_id: finalUserId,
      details: detailsStr
    });

    // 2. Log to AWS Database via Prisma
    await prisma.securityLogs.create({
      data: {
        event: params.event,
        user_id: finalUserId,
        email: params.email,
        ip_address: params.ip_address,
        user_agent: params.user_agent,
        details: detailsStr
        // We don't map new actor_type to Prisma unless we migrate the table physically too
      }
    });

    if (params.actor_type) {
        // Specifically route audit logs to a JSON payload locally for analysis
        logger.info(`STRUCTURAL_AUDIT`, params);
    }
  } catch (error) {
    console.error('Failed to write security log:', error);
  }
};
