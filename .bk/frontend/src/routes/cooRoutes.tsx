import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

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

export const cooRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/admin/coo" element={<ExecutiveDashboardLayout role="coo" />}>
      <Route index element={<Navigate to="/admin/coo/overview" replace />} />
      <Route path="dashboard" element={<Navigate to="/admin/coo/overview" replace />} />
      
      {/* Financial Operations */}
      <Route path="overview" element={<COOOverview />} />
      <Route path="transactions" element={<COOTransactions />} />
      <Route path="collections" element={<COOCollections />} />
      <Route path="wallets" element={<COOWallets />} />
      <Route path="analytics" element={<COOAnalytics />} />
      <Route path="agent-activity" element={<COOUsers />} />
      
      {/* Governance */}
      <Route path="reports" element={<COOReports />} />
      <Route path="alerts" element={<COOAlerts />} />
      <Route path="withdrawals" element={<COOWithdrawals />} />
      <Route path="partners" element={<COOPartnersPage />} />
      <Route path="partner-finance" element={<COODeposits />} />
      <Route path="staff-performance" element={<COOStaffPerformance />} />
      
      {/* Other mappings not strictly in side-bar but accessible */}
      <Route path="rent-approvals" element={<COOOverview />} />
      <Route path="partner-topups" element={<COODeposits />} />
      <Route path="users" element={<COOUsers />} />
      <Route path="users/:id" element={<COOUserProfile />} />
      <Route path="deposits" element={<COODeposits />} />
      <Route path="tenants" element={<COOTenants />} />
      <Route path="opportunities" element={<COOOpportunities />} />
      
      <Route path="*" element={<Navigate to="/admin/coo/overview" replace />} />
    </Route>
  </Route>
);
