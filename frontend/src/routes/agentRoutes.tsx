import { lazy } from 'react';
import { Route } from 'react-router-dom';

const AgentWelcome        = lazy(() => import('../agent/AgentWelcome'));
const AgentSignup         = lazy(() => import('../agent/AgentSignup'));
const AgentAgreement      = lazy(() => import('../agent/AgentAgreement'));
const AgentKYC            = lazy(() => import('../agent/AgentKYC'));
const AgentKYCReview      = lazy(() => import('../agent/AgentKYCReview'));
const AgentWithdraw       = lazy(() => import('../agent/AgentWithdraw'));
const AgentDeposit        = lazy(() => import('../agent/AgentDeposit'));
const AgentInvestForPartner = lazy(() => import('../agent/AgentInvestForPartner'));
const AgentRegisterTenant = lazy(() => import('../agent/AgentRegisterTenant'));

const AgentWallet         = lazy(() => import('../agent/AgentWallet'));
const AgentAnalytics      = lazy(() => import('../agent/AgentAnalytics'));
const AgentEditProfile    = lazy(() => import('../agent/AgentEditProfile'));
const AgentNotificationSettings = lazy(() => import('../agent/AgentNotificationSettings'));
const AgentSecurity       = lazy(() => import('../agent/AgentSecurity'));
const AgentPrivacyPolicy  = lazy(() => import('../agent/AgentPrivacyPolicy'));
const AgentTransfer       = lazy(() => import('../agent/AgentTransfer'));
const AgentRegisterSubAgent = lazy(() => import('../agent/AgentRegisterSubAgent'));
const AgentRegisterLandlord = lazy(() => import('../agent/AgentRegisterLandlord'));
const AgentRegisterInvestor = lazy(() => import('../agent/AgentRegisterInvestor'));
const AgentVisit          = lazy(() => import('../agent/AgentVisit'));
const AgentVisitDetail    = lazy(() => import('../agent/AgentVisitDetail'));
const AgentListHouse      = lazy(() => import('../agent/AgentListHouse'));
const AgentReceipt        = lazy(() => import('../agent/AgentReceipt'));
const AgentReferral       = lazy(() => import('../agent/AgentReferral'));
const AgentDailyOps       = lazy(() => import('../agent/AgentDailyOps'));
const AgentRequestAdvance = lazy(() => import('../agent/AgentRequestAdvance'));
const AgentAdvanceDetails = lazy(() => import('../agent/AgentAdvanceDetails'));
const AgentCashPayouts    = lazy(() => import('../agent/AgentCashPayouts'));
const AgentLandlordPayout = lazy(() => import('../agent/AgentLandlordPayout'));
const AgentRentRequests   = lazy(() => import('../agent/AgentRentRequests'));

// Marketplace Suite
const AgentShop             = lazy(() => import('../agent/shop/AgentShop'));
const AgentProductDetail    = lazy(() => import('../agent/shop/AgentProductDetail'));
const AgentCheckout         = lazy(() => import('../agent/shop/AgentCheckout'));
const AgentOrders           = lazy(() => import('../agent/shop/AgentOrders'));
const AgentSellerDashboard  = lazy(() => import('../agent/shop/AgentSellerDashboard'));

/**
 * Agent role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const agentRoutes = [
  <Route key="agent-welcome"         path="/agent-welcome"         element={<AgentWelcome />} />,
  <Route key="agent-signup"          path="/agent-signup"          element={<AgentSignup />} />,
  <Route key="agent-agreement"       path="/agent-agreement"       element={<AgentAgreement />} />,
  <Route key="agent-onboarding"      path="/agent-onboarding"      element={<AgentAgreement />} />,
  <Route key="agent-kyc"             path="/agent-kyc"             element={<AgentKYC />} />,
  <Route key="agent-kyc-review"      path="/agent-kyc-review"      element={<AgentKYCReview />} />,
  <Route key="agent-withdraw"        path="/agent-withdraw"        element={<AgentWithdraw />} />,
  <Route key="agent-deposit"         path="/agent-deposit"         element={<AgentDeposit />} />,
  <Route key="agent-invest-partner"  path="/agent-invest-partner"  element={<AgentInvestForPartner />} />,
  <Route key="agent-register-tenant" path="/agent-register-tenant" element={<AgentRegisterTenant />} />,
  <Route key="agent-analytics"       path="/agent-analytics"       element={<AgentAnalytics />} />,
  <Route key="agent-wallet"          path="/agent-wallet"          element={<AgentWallet />} />,
  <Route key="agent-edit-profile"    path="/agent-edit-profile"    element={<AgentEditProfile />} />,
  <Route key="agent-notification-settings" path="/agent-notification-settings" element={<AgentNotificationSettings />} />,
  <Route key="agent-security"        path="/agent-security"        element={<AgentSecurity />} />,
  <Route key="agent-privacy-policy"  path="/agent-privacy-policy"  element={<AgentPrivacyPolicy />} />,
  <Route key="agent-transfer"        path="/agent-transfer"        element={<AgentTransfer />} />,
  <Route key="agent-register-subagent" path="/agent-register-subagent" element={<AgentRegisterSubAgent />} />,
  <Route key="agent-register-landlord" path="/agent-register-landlord" element={<AgentRegisterLandlord />} />,
  <Route key="agent-register-investor" path="/agent-register-investor" element={<AgentRegisterInvestor />} />,
  <Route key="agent-visit"             path="/agent-visit"             element={<AgentVisit />} />,
  <Route key="agent-visit-detail"      path="/agent-visit/:tenantId"   element={<AgentVisitDetail />} />,
  <Route key="agent-list-house"        path="/agent-list-house"        element={<AgentListHouse />} />,
  <Route key="agent-advance-request"   path="/agent-advance-request"   element={<AgentRequestAdvance />} />,
  <Route key="agent-advance-details"   path="/agent-advances/:id"      element={<AgentAdvanceDetails />} />,
  <Route key="agent-cash-payouts"      path="/agent/cash-payouts"      element={<AgentCashPayouts />} />,
  <Route key="agent-landlord-payout"   path="/agent/landlord-payout"   element={<AgentLandlordPayout />} />,
  <Route key="agent-rent-requests"     path="/agent-rent-requests"     element={<AgentRentRequests />} />,
  <Route key="agent-receipt"           path="/agent-receipt"           element={<AgentReceipt />} />,
  <Route key="agent-referral"          path="/agent-referral"          element={<AgentReferral />} />,
  <Route key="agent-daily-ops"         path="/agent-daily-ops"         element={<AgentDailyOps />} />,
  
  // Marketplace Suite Routes
  <Route key="agent-shop"              path="/agent-shop"                        element={<AgentShop />} />,
  <Route key="agent-shop-product"      path="/agent-shop/product/:id"            element={<AgentProductDetail />} />,
  <Route key="agent-shop-checkout"     path="/agent-shop/checkout/:id"           element={<AgentCheckout />} />,
  <Route key="agent-shop-orders"       path="/agent-shop/orders"                 element={<AgentOrders />} />,
  <Route key="agent-shop-seller"       path="/agent-shop/seller"                 element={<AgentSellerDashboard />} />,
];
