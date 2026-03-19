import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { propertyId, amount, months } = req.body;

    if (!userId || !amount) {
      return problemResponse(res, 400, 'Validation Error', `Missing required data`, 'validation-error');
    }

    // Default calculations for early stage
    // From BUSINESS_LOGIC.md: access fee is compounded
    const durationDays = months * 30;
    const accessFee = amount * (Math.pow(1.33, durationDays / 30) - 1);
    const requestFee = amount > 200000 ? 20000 : 10000;
    const totalRepayment = amount + accessFee + requestFee;

    const request = await prisma.rentRequests.create({
      data: {
        tenant_id: userId,
        landlord_id: propertyId,
        rent_amount: amount,
        duration_days: durationDays,
        access_fee: accessFee,
        request_fee: requestFee,
        total_repayment: totalRepayment,
        status: 'PENDING',
        daily_repayment: Math.ceil(totalRepayment / durationDays),
        amount_repaid: 0,
        tenant_no_smartphone: false,
        lc1_id: 'default-lc1', // Placeholder based on schema
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error('Create rent request error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', `Unauthorized`, 'unauthorized');

    const requests = await prisma.rentRequests.findMany({
      where: { tenant_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.rentRequests.findMany({
      orderBy: { created_at: 'desc' },
    });
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Get all requests error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.rentRequests.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json(request);
  } catch (error) {
    console.error('Update rent request status error:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};
