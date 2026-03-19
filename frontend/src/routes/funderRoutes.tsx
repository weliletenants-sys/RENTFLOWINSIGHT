import { lazy } from 'react';
import { Route } from 'react-router-dom';

const FunderOnboarding = lazy(() => import('../funder/FunderOnboarding'));
const FunderDashboard  = lazy(() => import('../funder/FunderDashboard'));
const FunderSettings   = lazy(() => import('../funder/FunderAccountSettings'));
const ActivateFunder   = lazy(() => import('../funder/ActivateFunder'));
const FunderReports       = lazy(() => import('../funder/FunderReports'));
const FunderWallet        = lazy(() => import('../funder/FunderWallet'));
const FunderPortfolioPage = lazy(() => import('../funder/FunderPortfolioPage'));

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
  <Route key="funder-reports"    path="/funder/reports"    element={<FunderReports />} />,
  <Route key="funder-wallet"     path="/funder/wallet"     element={<FunderWallet />} />,
  <Route key="funder-portfolio"  path="/funder/portfolio"  element={<FunderPortfolioPage />} />,
];
