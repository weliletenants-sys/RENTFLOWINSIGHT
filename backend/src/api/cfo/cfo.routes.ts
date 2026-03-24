import express from 'express';
import {
  getOverview,
  getReconciliation,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  approveDeposit,
  getLedger,
  getStatements,
  getPendingCommissions,
  approveCommission,
  rejectCommission
} from '../../controllers/cfo.controller';

const router = express.Router();

// Dashboard Overview
router.get('/statistics/overview', getOverview);

// Reconciliation Engine
router.get('/reconciliations', getReconciliation);

// Approvals Gate
router.get('/withdrawals/pending', getPendingWithdrawals);
router.post('/withdrawals/:id/approvals', approveWithdrawal);
router.post('/withdrawals/:id/rejections', rejectWithdrawal);
router.put('/deposits/:id/approve', approveDeposit);

// Accounting
router.get('/ledger', getLedger);
router.get('/statements', getStatements);

// Commissions
router.get('/commissions/pending', getPendingCommissions);
router.post('/commissions/:id/approve', approveCommission);
router.post('/commissions/:id/reject', rejectCommission);

export default router;
