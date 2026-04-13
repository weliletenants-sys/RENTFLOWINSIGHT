import { Router } from 'express';
import { getKycStatus, submitKyc, getRecruitmentStats, requestAdvance, getAdvances } from '../../controllers/agent.controller';
import { authGuard } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/kyc', authGuard, getKycStatus);
router.post('/kyc', authGuard, submitKyc);
router.get('/statistics/recruitment', authGuard, getRecruitmentStats);

// Advance Requests Endpoints
router.get('/advances', authGuard, getAdvances);
router.post('/advances', authGuard, requestAdvance);

// Rent Requests Endpoints
import { fetchRentRequests, createRentRequest, processRentRequest } from '../../controllers/agent.rentRequests.controller';
router.get('/rent-requests', authGuard, fetchRentRequests);
router.post('/rent-requests', authGuard, createRentRequest);
router.patch('/rent-requests/:id/status', authGuard, processRentRequest);

// Module 1: Dashboard & Analytics
import { getDashboardSummary, getReferrals, getEarnings, getAgentLeaderboard } from '../../controllers/agent.dashboard.controller';
router.get('/statistics/dashboard', authGuard, getDashboardSummary);
router.get('/referrals', authGuard, getReferrals);
router.get('/earnings', authGuard, getEarnings);
router.get('/leaderboard', authGuard, getAgentLeaderboard);

// Module 2: Field Operations
import { recordVisit, recordCollection, issueReceipt, generatePaymentToken, generateTenantFormToken, uploadDeliveryConfirmation } from '../../controllers/agent.operations.controller';
router.post('/visits', authGuard, recordVisit);
router.post('/collections', authGuard, recordCollection);
router.post('/receipts', authGuard, issueReceipt);
router.post('/tokens', authGuard, generatePaymentToken);
router.post('/tenants/tokens/generate', authGuard, generateTenantFormToken);
router.post('/deliveries', authGuard, uploadDeliveryConfirmation);

// Module 3: Identity & Network Registrations
import { registerTenant, registerLandlord, registerSubAgent, registerInvestor, getMyNetwork, getAssignedTenants } from '../../controllers/agent.users.controller';
router.get('/tenants', authGuard, getAssignedTenants);
router.post('/tenants', authGuard, registerTenant);
router.post('/landlords', authGuard, registerLandlord);
router.post('/subagents', authGuard, registerSubAgent);
router.post('/investors', authGuard, registerInvestor);
router.get('/networks', authGuard, getMyNetwork);

// Module 4: Core Financials
import { requestDeposit, requestWithdrawal, proxyInvestment, getTransactions } from '../../controllers/agent.financials.controller';
router.post('/deposits', authGuard, requestDeposit);
router.post('/withdrawals', authGuard, requestWithdrawal);
router.post('/proxy-investments', authGuard, proxyInvestment);
router.get('/transactions', authGuard, getTransactions);

export default router;
