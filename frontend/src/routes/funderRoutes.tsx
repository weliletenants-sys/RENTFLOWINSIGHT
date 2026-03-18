import { lazy } from 'react';
import { Route } from 'react-router-dom';

const FunderOnboarding = lazy(() => import('../funder/FunderOnboarding'));
const FunderDashboard  = lazy(() => import('../funder/FunderDashboard'));
const FunderSettings   = lazy(() => import('../funder/FunderAccountSettings'));

/**
 * Funder role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const funderRoutes = [
  <Route key="funder-onboarding" path="/funder-onboarding" element={<FunderOnboarding />} />,
  // DEV ONLY: unprotected funder dashboard for frontend development
  <Route key="funder-dashboard"  path="/funder-dashboard"  element={<FunderDashboard />} />,
  <Route key="funder-account"    path="/funder/account"    element={<FunderSettings />} />,
  <Route key="funder-settings"   path="/settings"          element={<FunderSettings />} />
];
