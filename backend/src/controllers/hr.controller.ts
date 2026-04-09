import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getHROverview = async (req: Request, res: Response) => {
  try {
    const totalEmployees = await prisma.staffProfiles.count();
    const pendingLeave = await prisma.leaveRequests.count({ where: { status: 'pending' } });
    const warnings = await prisma.disciplinaryRecords.count({ where: { type: 'warning' } });
    
    return res.status(200).json({
      totalEmployees,
      pendingLeave,
      warnings
    });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal_error');
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.staffProfiles.findMany();
    return res.status(200).json(employees);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Error', error.message, 'internal_error');
  }
};

export const getPendingLeaveRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.leaveRequests.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' }
    });
    return res.status(200).json(requests);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Error', error.message, 'internal_error');
  }
};

export const approveLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const reviewerId = req.user?.sub;
    
    if (!['approved', 'rejected'].includes(status)) {
      return problemResponse(res, 400, 'Validation Error', 'Invalid status payload, must be approved or rejected.', 'validation_error');
    }

    const updated = await prisma.leaveRequests.update({
      where: { id },
      data: {
        status,
        reviewer_id: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    await prisma.auditLogs.create({
      data: {
        action_type: status === 'approved' ? 'hr_leave_approved' : 'hr_leave_rejected',
        user_id: reviewerId,
        table_name: 'leave_requests',
        record_id: updated.id,
        metadata: { reason },
        created_at: new Date().toISOString()
      }
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Error', error.message, 'internal_error');
  }
};

export const createDisciplinaryRecord = async (req: Request, res: Response) => {
  try {
    const { user_id, type, severity, description, evidence_url } = req.body;
    const issuerId = req.user?.sub;

    const record = await prisma.disciplinaryRecords.create({
      data: {
        user_id,
        issuer_id: issuerId,
        type,
        severity,
        description,
        evidence_url,
        issued_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    await prisma.auditLogs.create({
      data: {
        action_type: 'hr_disciplinary_issued',
        user_id: issuerId,
        table_name: 'disciplinary_records',
        record_id: record.id,
        metadata: { type, severity, description },
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json(record);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Error', error.message, 'internal_error');
  }
};

export const submitPayrollBatch = async (req: Request, res: Response) => {
  try {
    const { batch_name, period_start, period_end, total_amount } = req.body;
    const submittedBy = req.user?.sub;

    const batch = await prisma.payrollBatches.create({
      data: {
        batch_name,
        period_start,
        period_end,
        total_amount,
        submitted_by: submittedBy,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    await prisma.auditLogs.create({
      data: {
        action_type: 'hr_payroll_submitted',
        user_id: submittedBy,
        table_name: 'payroll_batches',
        record_id: batch.id,
        metadata: { batch_name, total_amount },
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json(batch);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Error', error.message, 'internal_error');
  }
};
