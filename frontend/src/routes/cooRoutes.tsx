import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import COOLayout from '../admin/coo/components/COOLayout';

const COOOverview = lazy(() => import('../admin/coo/COOOverview'));
const COOTransactions = lazy(() => import('../admin/coo/COOTransactions'));
const COOCollections = lazy(() => import('../admin/coo/COOCollections'));
const COOWallets = lazy(() => import('../admin/coo/COOWallets'));
const COOAnalytics = lazy(() => import('../admin/coo/COOAnalytics'));
const COOReports = lazy(() => import('../admin/coo/COOReports'));
const COOAlerts = lazy(() => import('../admin/coo/COOAlerts'));
const COOUsers = lazy(() => import('../admin/coo/COOUsers'));
const COOUserProfile = lazy(() => import('../admin/coo/COOUserProfile'));
const COOWithdrawals = lazy(() => import('../admin/coo/COOWithdrawals'));
const COODeposits = lazy(() => import('../admin/coo/COODeposits'));
const COOPartnersPage = lazy(() => import('../admin/coo/COOPartnersPage'));
const COOTenants = lazy(() => import('../admin/coo/COOTenants'));
const COOStaffPerformance = lazy(() => import('../admin/coo/COOStaffPerformance'));
const COOOpportunities = lazy(() => import('../admin/coo/COOOpportunities'));

export const cooRoutes = [
  <Route key="coo-index" path="/coo" element={<Navigate to="/coo/dashboard" replace />} />,
  <Route key="coo-dashboard" path="/coo/dashboard" element={<Navigate to="/coo/overview" replace />} />,
  <Route key="coo-overview" path="/coo/overview" element={<COOLayout pageTitle="Overview"><COOOverview /></COOLayout>} />,
  <Route key="coo-transactions" path="/coo/transactions" element={<COOLayout pageTitle="Financial Ledger"><COOTransactions /></COOLayout>} />,
  <Route key="coo-collections" path="/coo/collections" element={<COOLayout pageTitle="Agent Collections"><COOCollections /></COOLayout>} />,
  <Route key="coo-wallets" path="/coo/wallets" element={<COOLayout pageTitle="Wallet Monitoring"><COOWallets /></COOLayout>} />,
  <Route key="coo-analytics" path="/coo/analytics" element={<COOLayout pageTitle="Payment Analytics"><COOAnalytics /></COOLayout>} />,
  <Route key="coo-reports" path="/coo/reports" element={<COOLayout pageTitle="Financial Reports"><COOReports /></COOLayout>} />,
  <Route key="coo-alerts" path="/coo/alerts" element={<COOLayout pageTitle="Risk & Alerts"><COOAlerts /></COOLayout>} />,
  <Route key="coo-users" path="/coo/users" element={<COOLayout pageTitle="Global Users Registry"><COOUsers /></COOLayout>} />,
  <Route key="coo-user-profile" path="/coo/users/:id" element={<COOLayout pageTitle="Identity Management"><COOUserProfile /></COOLayout>} />,
  <Route key="coo-withdrawals" path="/coo/withdrawals" element={<COOLayout pageTitle="Withdrawals Engine"><COOWithdrawals /></COOLayout>} />,
  <Route key="coo-deposits" path="/coo/deposits" element={<COOLayout pageTitle="Deposit Tracking"><COODeposits /></COOLayout>} />,
  <Route key="coo-partners" path="/coo/partners" element={<COOLayout pageTitle="Partners Governance"><COOPartnersPage /></COOLayout>} />,
  <Route key="coo-tenants" path="/coo/tenants" element={<COOLayout pageTitle="Tenants Management"><COOTenants /></COOLayout>} />,
  <Route key="coo-staff-performance" path="/coo/staff-performance" element={<COOLayout pageTitle="Staff Performance"><COOStaffPerformance /></COOLayout>} />,
  <Route key="coo-opportunities" path="/coo/opportunities" element={<COOLayout pageTitle="Virtual Opportunities"><COOOpportunities /></COOLayout>} />,
];
