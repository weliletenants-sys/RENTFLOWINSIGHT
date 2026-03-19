import { lazy } from 'react';
import { Route } from 'react-router-dom';
import FunderLayout from '../funder/components/FunderLayout';

const FunderOnboarding = lazy(() => import('../funder/FunderOnboarding'));
const FunderDashboard  = lazy(() => import('../funder/FunderDashboard'));
const FunderSettings   = lazy(() => import('../funder/FunderAccountSettings'));
const ActivateFunder   = lazy(() => import('../funder/ActivateFunder'));
const FunderReports       = lazy(() => import('../funder/FunderReports'));
const FunderWallet        = lazy(() => import('../funder/FunderWallet'));
const FunderPortfolioPage = lazy(() => import('../funder/FunderPortfolioPage'));
const FunderOpportunitiesPage = lazy(() => import('../funder/FunderOpportunitiesPage'));

/**
 * Funder role routes — all pages are lazy-loaded.
 * 
 * Pages that have their OWN built-in sidebar/header (FunderDashboard, FunderSettings,
 * FunderReports, FunderWallet) are rendered standalone.
 * 
 * Pages that DON'T have their own layout (FunderPortfolioPage, FunderOpportunitiesPage)
 * are wrapped in FunderLayout.
 */
export const funderRoutes = [
  <Route key="funder-onboarding" path="/funder/onboarding" element={<FunderOnboarding />} />,
  <Route key="funder-activate"   path="/funder/activate"   element={<ActivateFunder />} />,
  // Pages with their own layout
  <Route key="funder-dashboard"  path="/funder"             element={<FunderDashboard />} />,
  <Route key="funder-account"    path="/funder/account"     element={<FunderSettings />} />,
  <Route key="funder-reports"    path="/funder/reports"     element={<FunderReports />} />,
  <Route key="funder-wallet"     path="/funder/wallet"      element={<FunderWallet />} />,
  // Pages needing FunderLayout wrapper
  <Route key="funder-portfolio"      path="/funder/portfolio"      element={<FunderLayout activePage="Properties" pageTitle="My Portfolio"><FunderPortfolioPage /></FunderLayout>} />,
  <Route key="funder-properties"     path="/funder/properties"     element={<FunderLayout activePage="Properties" pageTitle="My Properties"><FunderPortfolioPage /></FunderLayout>} />,
  <Route key="funder-opportunities"  path="/funder/opportunities"  element={<FunderLayout activePage="Opportunities" pageTitle="Opportunities"><FunderOpportunitiesPage /></FunderLayout>} />,
];
