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
router.get('/statistics/overview', getOverview);

// Reconciliation Engine
router.get('/reconciliations', getReconciliation);

// Approvals Gate
router.get('/withdrawals/pending', getPendingWithdrawals);
router.post('/withdrawals/:id/approvals', approveWithdrawal);
router.post('/withdrawals/:id/rejections', rejectWithdrawal);

// Accounting
router.get('/ledger', getLedger);
router.get('/statements', getStatements);

export default router;
