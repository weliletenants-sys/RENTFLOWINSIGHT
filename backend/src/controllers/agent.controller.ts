import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const application = await prisma.agentApplications.findFirst({
      where: { agent_id: userId }
    });

    if (!application) {
      return res.status(200).json({ status: 'NONE' });
    }

    if (application.status === 'PENDING') {
      return res.status(200).json({ status: 'UNDER_REVIEW' });
    }

    return res.status(200).json({ status: application.status });
  } catch (error) {
    console.error('getKycStatus error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const submitKyc = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const now = new Date().toISOString();

    const application = await prisma.agentApplications.upsert({
      where: { agent_id: userId },
      update: { status: 'PENDING', updated_at: now },
      create: { agent_id: userId, status: 'PENDING', submitted_at: now, updated_at: now }
    });

    return problemResponse(res, 200, 'Error', `KYC submitted successfully', status: 'UNDER_REVIEW`, 'error');
  } catch (error) {
    console.error('submitKyc error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const getRecruitmentStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const totalClients = await prisma.profiles.count({ where: { referrer_id: userId } });
    const verifiedClients = await prisma.profiles.count({ where: { referrer_id: userId, verified: true } });
    
    // Live metrics replacing the previous hard-coded ratio
    const pendingPayments = totalClients - verifiedClients;
    const conversionRate = totalClients === 0 ? 0 : Math.round((verifiedClients / totalClients) * 100);

    return res.status(200).json({
      totalClients,
      pendingPayments,
      conversionRate
    });
  } catch (error) {
    console.error('getRecruitmentStats error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const requestAdvance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { amount, advance_type, reason, expected_date } = req.body;
    
    // Safety check against hard limits or db limits
    const limitRecord = await prisma.creditAccessLimits.findFirst({
       where: { user_id: userId }
    });
    
    const maxLimit = limitRecord?.total_limit || 1000000;
    
    if (amount > maxLimit) {
      return res.status(400).json({
        type: 'https://api.welile.com/errors/bad-request',
        title: 'Bad Request',
        status: 400,
        detail: `Amount exceeds maximum accessible limit of UGX ${maxLimit}`,
        instance: req.originalUrl
      });
    }

    const numAmount = Number(amount);
    const durationDays = Number(req.body.duration_days) || 30; // Supported periods: 7, 14, 30, 60, 90
    
    // Advanced access fee formula: accessFee = principal * ((1.33)^(durationDays/30) - 1)
    const accessFee = numAmount * (Math.pow(1.33, durationDays / 30) - 1);
    const registrationFee = numAmount > 200000 ? 20000 : 10000;
    const totalPayable = numAmount + accessFee + registrationFee;
    const dailyDeduction = Math.ceil(totalPayable / durationDays);

    const now = new Date().toISOString();
    const expires = new Date();
    expires.setDate(expires.getDate() + durationDays); 

    const advance = await prisma.agentAdvances.create({
      data: {
        agent_id: userId,
        principal: numAmount,
        outstanding_balance: totalPayable, // Stores the computed total obligation
        registration_fee: registrationFee,
        advance_type: advance_type || 'Float / Operational',
        reason: reason || '',
        expected_date: expected_date || now,
        status: 'PENDING',
        cycle_days: durationDays,
        daily_rate: dailyDeduction, // Extracted formula deduction
        issued_by: 'SYSTEM',
        issued_at: now,
        expires_at: expires.toISOString(),
        created_at: now,
        updated_at: now
      }
    });

    return res.status(201).json({ message: 'Advance request successfully submitted', advance });

  } catch (error) {
    console.error('requestAdvance error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const getAdvances = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const advances = await prisma.agentAdvances.findMany({
      where: { agent_id: userId },
      orderBy: { created_at: 'desc' }
    });
    
    const limitRecord = await prisma.creditAccessLimits.findFirst({
       where: { user_id: userId }
    });
    const maxLimit = limitRecord?.total_limit || 1000000;

    return res.status(200).json({ advances, maxLimit });
  } catch (error) {
    console.error('getAdvances error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};
