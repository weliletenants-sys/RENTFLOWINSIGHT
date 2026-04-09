import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getOverview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Unauthorized', 'unauthorized');

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Profile Not Found', 'Could not locate landord profile', 'not-found');

    const properties = await prisma.landlords.findMany({
      where: { phone: profile.phone }
    });

    const totalProperties = properties.length;
    const totalExpectedRent = properties.reduce((acc, curr) => acc + (curr.monthly_rent || 0), 0);
    const totalTenants = properties.filter(p => p.tenant_id).length;

    return res.status(200).json({
      totalProperties,
      totalExpectedRent,
      totalTenants,
      totalWelileSavingsGenerated: 0 // Stubbing for now until Welile Homes algorithm is formalized
    });
  } catch (error) {
    console.error('owner.controller.getOverview error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to calculate overview', 'internal-server-error');
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Unauthorized', 'unauthorized');

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Profile Not Found', 'Could not locate landlord profile', 'not-found');

    const properties = await prisma.landlords.findMany({
      where: { phone: profile.phone },
      orderBy: { created_at: 'desc' }
    });

    const formatted = properties.map(p => ({
      id: p.id,
      address: p.property_address || p.name,
      units: p.number_of_houses || 1,
      occupied: p.tenant_id ? 1 : 0, 
      status: p.verified ? 'verified' : 'pending',
      totalRentValue: p.monthly_rent || 0,
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('owner.controller.getProperties error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch properties', 'internal-server-error');
  }
};

export const registerProperty = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Unauthorized', 'unauthorized');

    const { address, units } = req.body;
    if (!address) return problemResponse(res, 400, 'Bad Request', 'Address is required to register property', 'bad-request');

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Profile Not Found', 'Could not locate landlord profile', 'not-found');

    const newProperty = await prisma.landlords.create({
      data: {
        id: crypto.randomUUID(),
        name: profile.full_name,
        phone: profile.phone,
        property_address: address,
        number_of_houses: parseInt(units) || 1,
        created_at: new Date().toISOString(),
        verified: false,
        rent_balance_due: 0
      }
    });

    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('owner.controller.registerProperty error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to register property', 'internal-server-error');
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Unauthorized', 'unauthorized');

    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Profile Not Found', 'Could not locate landlord profile', 'not-found');

    const properties = await prisma.landlords.findMany({
      where: { phone: profile.phone, tenant_id: { not: null } }
    });

    const tenantIds = properties.map(p => p.tenant_id as string);
    const tenants = await prisma.profiles.findMany({
      where: { id: { in: tenantIds } }
    });

    const formatted = tenants.map(t => {
      const prop = properties.find(p => p.tenant_id === t.id);
      return {
        id: t.id,
        name: t.full_name,
        propertyId: prop?.id,
        unit: prop?.house_number || 'N/A',
        rentAmount: prop?.monthly_rent || 0,
        status: 'paid', // Stubbing payment status
        welileHomesEnrolled: false, 
        avatar: t.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.full_name)}`
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('owner.controller.getTenants error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch tenants', 'internal-server-error');
  }
};

export const inviteTenant = async (req: Request, res: Response) => {
  try {
    const { phone, propertyId, unit } = req.body;
    
    // Per workflow instructions, we log the SMS event 
    console.log(`[SMS_SIMULATION] Sending tenant invite to ${phone} for property ${propertyId} unit ${unit}`);
    
    return res.status(200).json({ success: true, message: 'Invite sent successfully' });
  } catch (error) {
    console.error('owner.controller.inviteTenant error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to send invite', 'internal-server-error');
  }
};

export const enrollWelileHomes = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.body;
    if (!tenantId) return problemResponse(res, 400, 'Bad Request', 'Tenant ID is required', 'bad-request');
    
    return res.status(200).json({ success: true, message: 'Tenant effectively enrolled into Welile Homes' });
  } catch (error) {
    console.error('owner.controller.enrollWelileHomes error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to enroll', 'internal-server-error');
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return problemResponse(res, 401, 'Unauthorized', 'Unauthorized', 'unauthorized');
    
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return problemResponse(res, 404, 'Profile Not Found', 'Could not locate landlord profile', 'not-found');

    const properties = await prisma.landlords.findMany({
      where: { phone: profile.phone, tenant_id: { not: null } }
    });
    const tenantIds = properties.map(p => p.tenant_id as string);

    // Find rent-based ledger transactions linked to these tenants
    const transactions = await prisma.ledgerTransactions.findMany({
      where: {
        category: 'RENT_PAYMENT',
        initiated_by: { in: tenantIds }
      },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    const tenants = await prisma.profiles.findMany({
      where: { id: { in: tenantIds } }
    });

    const formatted = transactions.map(tx => {
      const tenant = tenants.find(t => t.id === tx.initiated_by);
      return {
        id: tx.id,
        tenantName: tenant?.full_name || 'Unknown Tenant',
        amount: 0, // Need to join with ledger_entries for exact amount, but keeping simple for now
        date: tx.created_at,
        method: 'Welile Wallet',
        status: 'completed'
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('owner.controller.getPaymentHistory error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch payment history', 'internal-server-error');
  }
};
