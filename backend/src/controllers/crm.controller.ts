import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { problemResponse } from '../utils/problem';

const prisma = new PrismaClient();

export const getTickets = async (req: Request, res: Response) => {
  try {
    const rawNotifications = await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      take: 200
    });

    const enriched = await Promise.all(rawNotifications.map(async (n: any) => {
      let profile: any = null;
      if (n.user_id) {
        profile = await prisma.profiles.findUnique({ where: { id: n.user_id } });
      }
      
      return {
        id: n.id,
        user_id: n.user_id || 'SYS-000',
        user_name: profile?.full_name || 'System Auto',
        subject: n.title || 'Notification',
        message: n.message,
        type: n.type?.toLowerCase() || 'info',
        is_read: n.read || false,
        created_at: n.created_at
      };
    }));

    res.json({ tickets: enriched });
  } catch (error: any) {
    console.error('getTickets CRM error:', error);
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'urn:rentflow:error:internal');
  }
};
