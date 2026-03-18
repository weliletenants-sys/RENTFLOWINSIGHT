import { lazy } from 'react';
import { Route } from 'react-router-dom';

const FunderOnboarding = lazy(() => import('../funder/FunderOnboarding'));
const FunderDashboard  = lazy(() => import('../funder/FunderDashboard'));
const FunderSettings   = lazy(() => import('../funder/FunderAccountSettings'));
const ActivateFunder   = lazy(() => import('../funder/ActivateFunder'));

/**
 * Funder role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const funderRoutes = [
  <Route key="funder-onboarding" path="/funder/onboarding" element={<FunderOnboarding />} />,
  <Route key="funder-activate"   path="/funder/activate"   element={<ActivateFunder />} />,
  // Dashboard routing
  <Route key="funder-dashboard"  path="/funder"  element={<FunderDashboard />} />,
  <Route key="funder-account"    path="/funder/account"    element={<FunderSettings />} />,
];
