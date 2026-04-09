import { Router } from 'express';
import {
  getHROverview,
  getAllEmployees,
  getPendingLeaveRequests,
  approveLeaveRequest,
  createDisciplinaryRecord,
  submitPayrollBatch
} from '../../controllers/hr.controller';

const router = Router();

router.get('/overview', getHROverview);
router.get('/employees', getAllEmployees);
router.get('/leave', getPendingLeaveRequests);
router.post('/leave/:id/approve', approveLeaveRequest);
router.post('/disciplinary', createDisciplinaryRecord);
router.post('/payroll', submitPayrollBatch);

export default router;
