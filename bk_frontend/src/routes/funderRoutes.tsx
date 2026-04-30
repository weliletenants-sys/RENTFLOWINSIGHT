import { lazy } from 'react';
import { Route } from 'react-router-dom';
import FunderLayout from '../funder/components/FunderLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const FunderLogin      = lazy(() => import('../pages/auth/FunderLogin'));
const FunderOnboarding = lazy(() => import('../funder/FunderOnboarding'));
const FunderKYCOnboarding = lazy(() => import('../funder/FunderKYCOnboarding'));
const FunderDashboard  = lazy(() => import('../funder/FunderDashboard'));
const FunderSettings   = lazy(() => import('../funder/FunderAccountSettings'));
const ActivateFunder   = lazy(() => import('../funder/ActivateFunder'));
const FunderReports       = lazy(() => import('../funder/FunderReports'));
const FunderWallet        = lazy(() => import('../funder/FunderWallet'));
const FunderPortfolioPage = lazy(() => import('../funder/FunderPortfolioPage'));
const FunderPortfolioDetailsPage = lazy(() => import('../funder/FunderPortfolioDetailsPage'));
const FunderOpportunitiesPage = lazy(() => import('../funder/FunderOpportunitiesPage'));
const FunderProjectionsPage = lazy(() => import('../funder/FunderProjectionsPage'));
const FunderPolicyPage = lazy(() => import('../funder/FunderPolicyPage'));

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
  <Route key="funder-login"      path="/funder/login"      element={<FunderLogin />} />,
  <Route key="funder-onboarding" path="/funder/onboarding" element={<FunderOnboarding />} />,
  <Route key="funder-kyc" path="/funder/kyc" element={<FunderKYCOnboarding />} />,
  <Route key="funder-activate"   path="/funder/activate"   element={<ActivateFunder />} />,
  // Pages with their own layout
  <Route key="funder-dashboard"  path="/funder"             element={<ProtectedRoute><FunderDashboard /></ProtectedRoute>} />,
  <Route key="funder-account"    path="/funder/account"     element={<ProtectedRoute><FunderSettings /></ProtectedRoute>} />,
  <Route key="funder-reports"    path="/funder/reports"     element={<ProtectedRoute><FunderReports /></ProtectedRoute>} />,
  <Route key="funder-wallet"     path="/funder/wallet"      element={<ProtectedRoute><FunderWallet /></ProtectedRoute>} />,
  <Route key="funder-policy"     path="/funder/policy"      element={<ProtectedRoute><FunderPolicyPage /></ProtectedRoute>} />,
  // Pages needing FunderLayout wrapper
  <Route key="funder-portfolio"      path="/funder/portfolio"      element={<ProtectedRoute><FunderLayout activePage="Portfolio" pageTitle="My Portfolio"><FunderPortfolioPage /></FunderLayout></ProtectedRoute>} />,
  <Route key="funder-portfolio-details" path="/funder/portfolio/:id" element={<ProtectedRoute><FunderLayout activePage="Portfolio" pageTitle="Portfolio Details"><FunderPortfolioDetailsPage /></FunderLayout></ProtectedRoute>} />,
  <Route key="funder-opportunities"  path="/funder/opportunities"  element={<ProtectedRoute><FunderLayout activePage="Opportunities" pageTitle="Opportunities"><FunderOpportunitiesPage /></FunderLayout></ProtectedRoute>} />,
  <Route key="funder-projections" path="/funder/projections" element={<ProtectedRoute><FunderProjectionsPage /></ProtectedRoute>} />,
];
