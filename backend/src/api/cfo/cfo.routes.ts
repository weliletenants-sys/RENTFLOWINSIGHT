import express from 'express';
import {
  getOverview,
  getReconciliation,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getLedger,
  getStatements
} from '../../controllers/cfo.controller';

const router = express.Router();

// Dashboard Overview
router.get('/overview', getOverview);

// Reconciliation Engine
router.get('/reconciliation', getReconciliation);

// Approvals Gate
router.get('/approvals/withdrawals', getPendingWithdrawals);
router.post('/approvals/withdrawals/:id/approve', approveWithdrawal);
router.post('/approvals/withdrawals/:id/reject', rejectWithdrawal);

// Accounting
router.get('/ledger', getLedger);
router.get('/statements', getStatements);

export default router;
