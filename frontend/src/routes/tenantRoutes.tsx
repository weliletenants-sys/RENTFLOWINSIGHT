import { lazy } from 'react';
import { Route } from 'react-router-dom';

const TenantAgreement   = lazy(() => import('../tenant/TenantAgreement'));
const TenantOnboarding  = lazy(() => import('../tenant/TenantOnboarding'));
const ApplicationStatus = lazy(() => import('../tenant/ApplicationStatus'));
const RentRequestForm   = lazy(() => import('../pages/auth/RentRequestForm'));

/**
 * Tenant role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const tenantRoutes = [
  <Route key="tenant-agreement"   path="/tenant-agreement"   element={<TenantAgreement />} />,
  <Route key="tenant-onboarding"  path="/tenant-onboarding"  element={<TenantOnboarding />} />,
  <Route key="application-status" path="/application-status" element={<ApplicationStatus />} />,
  <Route key="rent-request"       path="/rent-request"       element={<RentRequestForm />} />,
];
