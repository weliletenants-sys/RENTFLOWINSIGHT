import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const startApplication = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
       return problemResponse(res, 401, 'Unauthorized', 'Authentication required', 'unauthorized');
    }

    const application = await prisma.rentRequests.create({
      data: {
        tenant_id: userId,
        status: 'DRAFT',
        request_city: data.city || 'Unknown',
        house_category: data.category || 'Standard',
        rent_amount: Number(data.amount) || 0,
        request_fee: 0,
        total_repayment: Number(data.amount) || 0,
        amount_repaid: 0,
        daily_repayment: 0,
        repayment_duration_days: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    res.status(201).json({ message: 'Application started', id: application.id, data: application });
  } catch (error: any) {
    problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-server-error');
  }
};

export const saveStep1 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.rentRequests.update({
        where: { id },
        data: { updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Step 1 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 1' });
  }
};

export const saveStep2 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.rentRequests.update({
        where: { id },
        data: { updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Step 2 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 2' });
  }
};

export const saveStep3 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.rentRequests.update({
        where: { id },
        data: { updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Step 3 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 3' });
  }
};

export const saveStep4 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.rentRequests.update({
        where: { id },
        data: { status: 'MANAGER_REVIEW', updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Step 4 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 4' });
  }
};

export const getApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.rentRequests.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Application details', id, data: application });
  } catch(error) {
    res.status(500).json({ message: 'Error fetching application' });
  }
};

export const startAgentKyc = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
       return problemResponse(res, 401, 'Unauthorized', 'Authentication required', 'unauthorized');
    }

    const application = await prisma.agentApplications.create({
       data: {
          agent_id: userId,
          status: 'DRAFT',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
       }
    });
    res.status(201).json({ message: 'Agent KYC started', id: application.id, data: application });
  } catch (error: any) {
    res.status(500).json({ message: 'Error starting agent kyc' });
  }
};

export const saveAgentKycStep1 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.agentApplications.update({
        where: { id },
        data: { updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Agent KYC Step 1 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 1' });
  }
};

export const saveAgentKycStep2 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.agentApplications.update({
        where: { id },
        data: { updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Agent KYC Step 2 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 2' });
  }
};

export const saveAgentKycStep3 = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
     const updated = await prisma.agentApplications.update({
        where: { id },
        data: { status: 'PENDING', updated_at: new Date().toISOString() }
     });
     res.status(200).json({ message: 'Agent KYC Step 3 saved', id, data: updated });
  } catch(error) {
     res.status(500).json({ message: 'Error saving step 3' });
  }
};

export const getAgentApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.agentApplications.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Agent Application details', id, data: application });
  } catch(error) {
    res.status(500).json({ message: 'Error fetching application' });
  }
};
