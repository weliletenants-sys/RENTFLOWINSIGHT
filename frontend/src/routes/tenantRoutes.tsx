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

// Universal Services
const CentralWalletView       = lazy(() => import('../pages/wallet/CentralWalletView'));

/**
 * Tenant role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const tenantRoutes = [
  <Route key="tenant-wallet"      path="wallet"              element={<CentralWalletView />} />,
  <Route key="tenant-dashboard"   path="dashboard"          element={<TenantDashboard />} />,
  <Route key="find-a-house"       path="/find-a-house"       element={<TenantPropertyExplorer />} />,
  <Route key="tenant-calculator"  path="/calculator"         element={<TenantCalculator />} />,
  <Route key="payment-schedule"   path="/payment-schedule"   element={<TenantPaymentSchedule />} />,
  
  <Route key="tenant-agreement"   path="/tenant-agreement"   element={<TenantAgreement />} />,
  <Route key="tenant-onboarding"  path="/tenant-onboarding"  element={<TenantOnboarding />} />,
  <Route key="application-status" path="/application-status" element={<ApplicationStatus />} />,
  <Route key="rent-request"       path="/rent-request"       element={<RentRequestForm />} />,
];
