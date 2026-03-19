import { Router } from 'express';
import { getKycStatus, submitKyc, getRecruitmentStats, requestAdvance, getAdvances } from '../controllers/agent.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/kyc-status', authGuard, getKycStatus);
router.post('/kyc/submit', authGuard, submitKyc);
router.get('/recruitment-stats', authGuard, getRecruitmentStats);

// Advance Requests Endpoints
router.get('/advances', authGuard, getAdvances);
router.post('/advances/request', authGuard, requestAdvance);

// Rent Requests Endpoints
import { fetchRentRequests, createRentRequest, processRentRequest } from '../controllers/agent.rentRequests.controller';
router.get('/rent-requests', authGuard, fetchRentRequests);
router.post('/rent-requests', authGuard, createRentRequest);
router.put('/rent-requests/:id/process', authGuard, processRentRequest);

// Module 1: Dashboard & Analytics
import { getDashboardSummary, getReferrals, getEarnings } from '../controllers/agent.dashboard.controller';
router.get('/dashboard/summary', authGuard, getDashboardSummary);
router.get('/referrals', authGuard, getReferrals);
router.get('/earnings', authGuard, getEarnings);

// Module 2: Field Operations
import { recordVisit, recordCollection, issueReceipt } from '../controllers/agent.operations.controller';
router.post('/operations/visit', authGuard, recordVisit);
router.post('/operations/collection', authGuard, recordCollection);
router.post('/operations/receipt', authGuard, issueReceipt);

// Module 3: Identity & Network Registrations
import { registerTenant, registerLandlord, registerSubAgent, registerInvestor, getMyNetwork } from '../controllers/agent.users.controller';
router.post('/users/tenant', authGuard, registerTenant);
router.post('/users/landlord', authGuard, registerLandlord);
router.post('/users/subagent', authGuard, registerSubAgent);
router.post('/users/investor', authGuard, registerInvestor);
router.get('/network', authGuard, getMyNetwork);

// Module 4: Core Financials
import { requestDeposit, requestWithdrawal, proxyInvestment, getTransactions } from '../controllers/agent.financials.controller';
router.post('/financials/deposit', authGuard, requestDeposit);
router.post('/financials/withdrawal', authGuard, requestWithdrawal);
router.post('/financials/proxy-investment', authGuard, proxyInvestment);
router.get('/financials/transactions', authGuard, getTransactions);

export default router;
