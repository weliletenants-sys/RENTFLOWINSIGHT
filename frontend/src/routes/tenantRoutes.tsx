import { lazy } from 'react';
import { Route } from 'react-router-dom';

const TenantAgreement   = lazy(() => import('../tenant/TenantAgreement'));
const TenantOnboarding  = lazy(() => import('../tenant/TenantOnboarding'));
const ApplicationStatus = lazy(() => import('../tenant/ApplicationStatus'));
const RentRequestForm   = lazy(() => import('../pages/auth/RentRequestForm'));

// Core Tenant Workflows
const TenantDashboard         = lazy(() => import('../tenant/TenantDashboard'));
const TenantPropertyExplorer  = lazy(() => import('../tenant/TenantPropertyExplorer'));
const TenantCalculator        = lazy(() => import('../tenant/TenantCalculator'));
const TenantPaymentSchedule   = lazy(() => import('../tenant/TenantPaymentSchedule'));
const TenantLoans             = lazy(() => import('../tenant/TenantLoans'));
const TenantPayLandlord       = lazy(() => import('../tenant/TenantPayLandlord'));
const TenantPayWelile         = lazy(() => import('../tenant/TenantPayWelile'));
const TenantReceipts          = lazy(() => import('../tenant/TenantReceipts'));
const TenantWelileHomes       = lazy(() => import('../tenant/TenantWelileHomes'));
const TenantReferrals         = lazy(() => import('../tenant/TenantReferrals'));
const TenantFinancialStatement= lazy(() => import('../tenant/TenantFinancialStatement'));
const TenantSettings          = lazy(() => import('../tenant/TenantSettings'));
const TenantEditProfile       = lazy(() => import('../tenant/TenantEditProfile'));
const TenantSecurity          = lazy(() => import('../tenant/TenantSecurity'));

// [DEV ONLY] Inject Agent Dashboard for UI review.
const AgentDashboard          = lazy(() => import('../agent/AgentDashboard'));
// Universal Services
const CentralWalletView       = lazy(() => import('../pages/wallet/CentralWalletView'));

/**
 * Tenant role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const tenantRoutes = [
  <Route key="tenant-wallet"      path="wallet"              element={<CentralWalletView />} />,
  // [DEV ONLY] Auto-force AgentDashboard for UI review.
  <Route key="tenant-dashboard"   path="dashboard"          element={<AgentDashboard />} />,
  <Route key="find-a-house"       path="/find-a-house"       element={<TenantPropertyExplorer />} />,
  <Route key="tenant-calculator"  path="/calculator"         element={<TenantCalculator />} />,
  <Route key="payment-schedule"   path="/payment-schedule"   element={<TenantPaymentSchedule />} />,
  <Route key="tenant-loans"       path="/my-loans"           element={<TenantLoans />} />,
  <Route key="pay-landlord"       path="/pay-landlord"       element={<TenantPayLandlord />} />,
  <Route key="pay-welile"         path="/pay-welile"         element={<TenantPayWelile />} />,
  <Route key="my-receipts"        path="/my-receipts"        element={<TenantReceipts />} />,
  <Route key="welile-homes"       path="/welile-homes"       element={<TenantWelileHomes />} />,
  <Route key="referrals"          path="/referrals"          element={<TenantReferrals />} />,
  <Route key="financial-statement"path="/financial-statement"element={<TenantFinancialStatement />} />,
  <Route key="settings"           path="/settings"           element={<TenantSettings />} />,
  <Route key="edit-profile"       path="/settings/profile"   element={<TenantEditProfile />} />,
  <Route key="security"           path="/settings/security"  element={<TenantSecurity />} />,
  
  <Route key="tenant-agreement"   path="/tenant-agreement"   element={<TenantAgreement />} />,
  <Route key="tenant-onboarding"  path="/tenant-onboarding"  element={<TenantOnboarding />} />,
  <Route key="application-status" path="/application-status" element={<ApplicationStatus />} />,
  <Route key="rent-request"       path="/rent-request"       element={<RentRequestForm />} />,
];
