import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const notifications = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    return res.status(200).json({ status: 'success', data: notifications });
  } catch (error: any) {
    console.error('getNotifications error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const notification = await prisma.notifications.findUnique({ where: { id } });
    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ status: 'error', message: 'Notification not found' });
    }

    const updated = await prisma.notifications.update({
      where: { id },
      data: { is_read: true, updated_at: new Date().toISOString() }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to mark read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true, updated_at: new Date().toISOString() }
    });

    return res.status(200).json({ status: 'success', message: 'All marked as read' });
  } catch (error: any) {
    console.error('markAllAsRead error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to mark all read' });
  }
};
