import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';

export const fetchRentRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await prisma.agentRentRequests.findMany({
      where: { agent_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error('fetchRentRequests error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRentRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { tenant_id, tenant_name, phone, amount, duration_days } = req.body;

    // Check for explicit duplicates (same tenant, same amount, still pending)
    const existing = await prisma.agentRentRequests.findFirst({
       where: {
          agent_id: userId,
          amount: Number(amount),
          status: 'Pending',
          ...(tenant_id ? { tenant_id } : { tenant_name })
       }
    });

    if (existing) {
       return res.status(400).json({ message: 'A pending request for this tenant and amount already exists.' });
    }

    const now = new Date().toISOString();

    const request = await prisma.agentRentRequests.create({
      data: {
        agent_id: userId,
        tenant_id: tenant_id || null,
        tenant_name: tenant_name || null,
        phone: phone || null,
        amount: Number(amount),
        status: 'Pending',
        created_at: now,
        updated_at: now
      }
    });

    return res.status(201).json({ message: 'Rent request created', request });
  } catch (error) {
    console.error('createRentRequest error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const processRentRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;

    const request = await prisma.agentRentRequests.findUnique({
      where: { id }
    });

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.agent_id !== userId) return res.status(403).json({ message: 'Forbidden' });
    if (request.status !== 'Approved') return res.status(400).json({ message: 'Only approved requests can be explicitly processed.' });

    const now = new Date().toISOString();

    const updated = await prisma.agentRentRequests.update({
      where: { id },
      data: {
        status: 'Processed',
        processed_at: now,
        updated_at: now
      }
    });

    // We can also automate Wallet logic or General Ledger logic here sequentially

    return res.status(200).json({ message: 'Rent request formally processed to execution', request: updated });
  } catch (error) {
    console.error('processRentRequest error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
