import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';

export const getCrmMetrics = async (req: Request, res: Response) => {
  try {
    const [
      totalInquiries,
      unreadInquiries,
      supportTickets,
      warningAlerts,
      readInquiries
    ] = await Promise.all([
      prisma.notifications.count(),
      prisma.notifications.count({ where: { is_read: false } }),
      prisma.notifications.count({ where: { type: { in: ['support', 'inquiry'] } } }),
      prisma.notifications.count({ where: { type: 'warning' } }),
      prisma.notifications.count({ where: { is_read: true } })
    ]);

    const distinctUsersResult = await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(DISTINCT user_id) as count FROM "notifications" WHERE user_id IS NOT NULL`;
    const uniqueUsers = Number(distinctUsersResult[0]?.count || 0);

    const readRate = totalInquiries > 0 ? ((readInquiries / totalInquiries) * 100).toFixed(1) : '0.0';

    // Fetch the latest 100 notifications for the table
    const inquiries = await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      take: 100
    });

    // Manually join Profiles since Prisma relation is missing
    const userIds = Array.from(new Set(inquiries.filter(i => i.user_id).map(i => i.user_id as string)));
    let userMap: Record<string, { full_name: string }> = {};
    if (userIds.length > 0) {
      const users = await prisma.profiles.findMany({
        where: { id: { in: userIds } },
        select: { id: true, full_name: true }
      });
      userMap = users.reduce((acc, user) => {
        acc[user.id] = { full_name: user.full_name };
        return acc;
      }, {} as Record<string, { full_name: string }>);
    }

    res.json({
      kpis: {
        totalInquiries,
        unreadCount: unreadInquiries,
        uniqueUsers,
        supportTickets,
        warningAlerts,
        readRate: parseFloat(readRate)
      },
      inquiries: inquiries.map(n => ({
        id: n.id,
        createdAt: n.created_at || new Date().toISOString(),
        subject: n.title,
        type: n.type || 'info',
        isRead: n.is_read || false,
        messagePreview: n.message.substring(0, 80) + (n.message.length > 80 ? '...' : ''),
        user: n.user_id ? (userMap[n.user_id]?.full_name || 'Unknown User') : 'System'
      }))
    });
  } catch (error) {
    console.error('Failed to fetch CRM metrics:', error);
    res.status(500).json({ error: 'Internal server error while fetching CRM data.' });
  }
};
