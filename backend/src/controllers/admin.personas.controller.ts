import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

/**
 * GET /api/v1/admin/requisitions
 * Fetch all pending persona applications for CRM review.
 */
export const getRequisitions = async (req: Request, res: Response) => {
  try {
    const requisitions = await prisma.personaRequisitions.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: { email: true, full_name: true, phone: true }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    return res.status(200).json(requisitions);
  } catch (error) {
    console.error('getRequisitions error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to fetch requisitions', 'urn:rentflow:error:internal');
  }
};

/**
 * POST /api/v1/admin/requisitions/:id/approve
 * Approves a pending requisition and grants the user the requested persona mode.
 */
export const approveRequisition = async (req: Request, res: Response) => {
  try {
    const managerId = req.user.sub;
    const { id } = req.params;

    const requisition = await prisma.personaRequisitions.findUnique({ where: { id } });

    if (!requisition) {
      return problemResponse(res, 404, 'Not Found', 'Requisition not found', 'urn:rentflow:error:not-found');
    }

    if (requisition.status !== 'pending') {
      return problemResponse(res, 400, 'Bad Request', `Requisition is already ${requisition.status}`, 'urn:rentflow:error:invalid-state');
    }

    // Wrap in a transaction to ensure atomic history
    await prisma.$transaction(async (tx) => {
      // 1. Mark requisition as approved
      await tx.personaRequisitions.update({
        where: { id },
        data: {
          status: 'approved',
          reviewed_by: managerId,
          updated_at: new Date()
        }
      });

      // 2. Grant the persona
      await tx.userPersonas.upsert({
        where: {
          user_id_persona: {
            user_id: requisition.user_id,
            persona: requisition.requested_persona
          }
        },
        update: {},
        create: {
          user_id: requisition.user_id,
          persona: requisition.requested_persona,
          is_default: false
        }
      });
    });

    return res.status(200).json({ message: `Persona ${requisition.requested_persona} approved and granted.` });
  } catch (error) {
    console.error('approveRequisition error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to approve requisition', 'urn:rentflow:error:internal');
  }
};

/**
 * POST /api/v1/admin/requisitions/:id/reject
 * Rejects a pending requisition.
 */
export const rejectRequisition = async (req: Request, res: Response) => {
  try {
    const managerId = req.user.sub;
    const { id } = req.params;

    const requisition = await prisma.personaRequisitions.findUnique({ where: { id } });

    if (!requisition) {
      return problemResponse(res, 404, 'Not Found', 'Requisition not found', 'urn:rentflow:error:not-found');
    }

    if (requisition.status !== 'pending') {
      return problemResponse(res, 400, 'Bad Request', `Requisition is already ${requisition.status}`, 'urn:rentflow:error:invalid-state');
    }

    await prisma.personaRequisitions.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewed_by: managerId,
        updated_at: new Date()
      }
    });

    return res.status(200).json({ message: 'Requisition cleanly rejected.' });
  } catch (error) {
    console.error('rejectRequisition error:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to reject requisition', 'urn:rentflow:error:internal');
  }
};
