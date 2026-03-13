import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { propertyId, amount, months } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // Default calculations for early stage
    // From BUSINESS_LOGIC.md: access fee is compounded
    const durationDays = months * 30;
    const accessFee = amount * (Math.pow(1.33, durationDays / 30) - 1);
    const requestFee = amount > 200000 ? 20000 : 10000;
    const totalRepayment = amount + accessFee + requestFee;

    const request = await prisma.rentRequest.create({
      data: {
        tenantId: userId,
        propertyId,
        rentAmount: amount,
        durationDays,
        accessFee,
        requestFee,
        status: 'PENDING',
        dailyRepayment: Math.ceil(totalRepayment / durationDays),
        amountRepaid: 0,
        tenantNoSmartphone: false,
        lc1Id: 'default-lc1', // Placeholder based on schema
      },
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error('Create rent request error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await prisma.rentRequest.findMany({
      where: { tenantId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.rentRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Get all requests error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.rentRequest.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json(request);
  } catch (error) {
    console.error('Update rent request status error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
