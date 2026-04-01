import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getRentProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');

    const latestActiveRent = await prisma.rentRequests.findFirst({
      where: { tenant_id: userId, NOT: { status: 'REJECTED' } },
      orderBy: { created_at: 'desc' },
    });

    if (!latestActiveRent) {
      return res.status(200).json({
        activeRent: null,
        amountPaid: 0,
        totalRent: 0,
        daysLeft: 0,
        remainingAmount: 0,
        currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      });
    }

    const amountPaid = latestActiveRent.amount_repaid || 0;
    const totalRent = latestActiveRent.rent_amount || 0;
    const remainingAmount = Math.max(0, totalRent - amountPaid);
    
    const createdDate = new Date(latestActiveRent.created_at);
    const endDate = new Date(createdDate.getTime() + (latestActiveRent.duration_days || 30) * 24 * 60 * 60 * 1000);
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

    return res.status(200).json({
      activeRent: {
        status: latestActiveRent.status?.toLowerCase() || 'unknown',
        rentFinanced: latestActiveRent.rent_amount || 0
      },
      amountPaid,
      totalRent,
      daysLeft,
      remainingAmount,
      currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });
  } catch (error) {
    console.error('getRentProgress error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');

    const repayments = await prisma.repayments.findMany({
      where: { tenant_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const activities = repayments.map(r => ({
      id: r.id,
      description: 'Rent Payment',
      amount: r.amount,
      date: r.created_at,
      type: 'payment'
    }));

    return res.status(200).json(activities);
  } catch (error) {
    console.error('getRecentActivities error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const getAgreementStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');

    const acceptance = await prisma.tenantAgreementAcceptance.findFirst({
      where: { tenant_id: userId, status: 'ACCEPTED' },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ hasAcceptedTerms: !!acceptance });
  } catch (error) {
    console.error('getAgreementStatus error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const acceptAgreement = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');

    const { version, ipAddress, deviceInfo } = req.body;

    await prisma.tenantAgreementAcceptance.create({
      data: {
        tenant_id: userId,
        agreement_version: version || '1.0.0',
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        ip_address: ipAddress || req.ip,
        device_info: deviceInfo || req.headers['user-agent'],
      }
    });

    return res.status(200).json({ success: true, message: 'Agreement accepted' });
  } catch (error) {
    console.error('acceptAgreement error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};
