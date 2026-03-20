import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const recordVisit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { latitude, longitude, accuracy, location_name, tenant_id } = req.body;
    const now = new Date().toISOString();

    const visit = await prisma.agentVisits.create({
      data: {
        agent_id: userId,
        tenant_id,
        latitude: Number(latitude),
        longitude: Number(longitude),
        accuracy: accuracy ? Number(accuracy) : null,
        location_name,
        checked_in_at: now,
        created_at: now
      }
    });

    return res.status(201).json({ message: 'GPS Visit successfully tracked', visit });
  } catch (error) {
    console.error('recordVisit error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const recordCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { amount, payment_method, notes, tracking_id, momo_transaction_id, tenant_id } = req.body;
    const numAmount = Number(amount);

    if (numAmount <= 0) return res.status(400).json({
      type: 'https://api.welile.com/errors/bad-request',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid amount. Minimum amount is 1.',
      instance: req.originalUrl
    });

    // Validate against Float Limit securely without allowing frontend spoofing
    const floatRecord = await prisma.agentFloatLimits.findFirst({
      orderBy: { created_at: 'desc' }
    });

    let currentCollected = floatRecord?.collected_today || 0;
    let limit = floatRecord?.float_limit || 1000000; // Mock default

    if (numAmount + currentCollected > limit) {
       return res.status(400).json({
         type: 'https://api.welile.com/errors/bad-request',
         title: 'Float Limit Exceeded',
         status: 400,
         detail: 'Transaction exceeds your daily collection float limit.',
         instance: req.originalUrl
       });
    }

    const now = new Date().toISOString();

    const collection = await prisma.agentCollections.create({
      data: {
        agent_id: userId,
        tenant_id,
        amount: numAmount,
        payment_method,
        notes,
        tracking_id,
        momo_transaction_id,
        float_before: currentCollected,
        float_after: currentCollected + numAmount,
        created_at: now
      }
    });

    // Optimistically update the mock float limit
    if (floatRecord) {
        await prisma.agentFloatLimits.update({
            where: { id: floatRecord.id },
            data: { collected_today: currentCollected + numAmount, updated_at: now }
        });
    }

    return res.status(201).json({ message: 'Collection Recorded successfully', collection });
  } catch (error) {
    console.error('recordCollection error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const issueReceipt = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { amount, payer_name, payer_phone, payment_method, notes, transaction_id } = req.body;
    
    const receipt = await prisma.agentReceipts.create({
      data: {
        agent_id: userId,
        amount: Number(amount),
        payer_name,
        payer_phone,
        payment_method,
        notes,
        transaction_id,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Official Receipt Generated', receipt });
  } catch (error) {
    console.error('issueReceipt error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};
