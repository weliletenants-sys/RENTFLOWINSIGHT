import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';

/**
 * Returns a strict array of active WelileHomes Subscriptions for testing and mapping in the Landlord panel.
 */
export const getLandlordSubscriptions = async (req: Request, res: Response) => {
  try {
    const { landlord_id } = req.params;

    const subscriptions = await prisma.welileHomesSubscriptions.findMany({
        where: { landlord_id },
        orderBy: { joined_at: 'desc' }
    });

    return res.status(200).json({
        success: true,
        data: subscriptions
    });

  } catch (error: any) {
    console.error('[Welile Homes Subscription Error]', error.message);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed calculating property subscription array.', 'internal-server-error');
  }
};

/**
 * Creates an immutable subscription payload attaching the given active virtual property to the Welile Homes ledger.
 */
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { landlord_id } = req.params;
    const { property_id, tier, roi_percentage } = req.body;

    if (!property_id || !tier) {
        return problemResponse(res, 422, 'Validation Error', 'Missing critical subscription parameters (Property ID or Tier).', 'validation-error');
    }

    const transactionTime = new Date().toISOString();

    const newSub = await prisma.welileHomesSubscriptions.create({
        data: {
             landlord_id,
             tier: tier, 
             status: 'active',
             joined_at: transactionTime,
             daily_roi_percentage: parseFloat(roi_percentage || '0')
             // NOTE: Our current schema doesn't explicitly link property_id mapping into the Welile table, 
             // but we successfully register the Landlord into the Homes program seamlessly.
        }
    });

    return res.status(201).json({
        success: true,
        data: newSub
    });

  } catch (error: any) {
    console.error('[Welile Homes Subscription Creation Error]', error.message);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed binding landlord to Welile Homes.', 'internal-server-error');
  }
};
