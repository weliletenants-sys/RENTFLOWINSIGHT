import { Request, Response } from 'express';
import { problemResponse } from '../utils/problem';

export const getLandlordOpsOverview = async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      metrics: {
        pendingListings: 8,
        disputes: 2,
        welileHomesEnrolled: 45
      }
    });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch landlord operations overview.', 'server-error');
  }
};

export const verifyListing = async (req: Request, res: Response) => {
  try {
    const { propertyId, status, reason } = req.body;
    if (!propertyId || !status) return res.status(400).json({ error: 'Bad Request' });

    res.json({ status: 'ok', message: `Property listing ${status}` });
  } catch (error) {
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to verify listing', 'server-error');
  }
};
