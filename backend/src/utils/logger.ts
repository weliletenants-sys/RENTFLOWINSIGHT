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
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  details?: any;
}) => {
  try {
    const detailsStr = params.details ? JSON.stringify(params.details) : null;
    
    // 1. Log to physical file via Winston
    logger.info(`Security Event: ${params.event}`, {
      ...params,
      details: detailsStr
    });

    // 2. Log to AWS Database via Prisma
    await prisma.securityLogs.create({
      data: {
        event: params.event,
        user_id: params.user_id,
        email: params.email,
        ip_address: params.ip_address,
        user_agent: params.user_agent,
        details: detailsStr
      }
    });
  } catch (error) {
    console.error('Failed to write security log:', error);
  }
};
