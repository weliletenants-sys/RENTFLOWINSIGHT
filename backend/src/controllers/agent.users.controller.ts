import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    // Assuming tenant unified registration links to global auth system.
    // We mock the DB binding for now pending specific Firebase/Supabase payload.
    const { name, phone, district, reference } = req.body;

    // A real implementation would push to user_roles
    return res.status(201).json({ message: 'Tenant onboarded successfully', tenant: { name, phone }});
  } catch (error) {
    console.error('registerTenant error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const registerLandlord = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { name, phone, property_address, monthly_rent, house_category, district, is_agent_managed, management_fee_rate } = req.body;

    const landlord = await prisma.landlords.create({
      data: {
        name,
        phone,
        property_address,
        monthly_rent: monthly_rent ? Number(monthly_rent) : null,
        house_category,
        district,
        is_agent_managed: Boolean(is_agent_managed),
        managed_by_agent_id: is_agent_managed ? userId : null,
        management_fee_rate: management_fee_rate ? Number(management_fee_rate) : null,
        rent_balance_due: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Landlord secured successfully', landlord });
  } catch (error) {
    console.error('registerLandlord error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const registerSubAgent = async (req: Request, res: Response) => {
  try {
    const parentId = req.user?.sub;
    if (!parentId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { sub_agent_name, phone } = req.body;
    // In reality, this requires the sub-agent to formally exist. We record the binding.
    // Creating a mock mapping entry for now.
    
    const subAgent = await prisma.agentSubagents.create({
      data: {
        parent_agent_id: parentId,
        sub_agent_id: 'pending_auth_uuid_for_' + phone,
        source: 'AGENT_REFERRAL',
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Sub-agent binding created', subAgent });
  } catch (error) {
    console.error('registerSubAgent error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const registerInvestor = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const { account_name, investment_amount, duration_months, roi_percentage, roi_mode } = req.body;

    const portfolio = await prisma.investorPortfolios.create({
      data: {
        account_name,
        investment_amount: Number(investment_amount),
        duration_months: Number(duration_months),
        roi_percentage: Number(roi_percentage),
        roi_mode,
        status: 'pending_approval',
        agent_id: userId,
        portfolio_code: 'PF-' + Math.floor(Math.random() * 90000 + 10000),
        portfolio_pin: '0000', // Default pending
        activation_token: Math.random().toString(36).substring(7),
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Proxy Investor Portfolio secured', portfolio });
  } catch (error) {
    console.error('registerInvestor error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};

export const getMyNetwork = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({
      type: 'https://api.welile.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid authentication token',
      instance: req.originalUrl
    });

    const network = await prisma.agentSubagents.findMany({
      where: { parent_agent_id: userId }
    });

    return res.status(200).json({ network });
  } catch (error) {
    console.error('getMyNetwork error:', error);
    return res.status(500).json({
      type: 'https://api.welile.com/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while processing the request',
      instance: req.originalUrl
    });
  }
};
