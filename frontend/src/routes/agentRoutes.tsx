import { lazy } from 'react';
import { Route } from 'react-router-dom';

const AgentWelcome    = lazy(() => import('../agent/AgentWelcome'));
const AgentSignup     = lazy(() => import('../agent/AgentSignup'));
const AgentAgreement  = lazy(() => import('../agent/AgentAgreement'));
const AgentKYC        = lazy(() => import('../agent/AgentKYC'));
const AgentKYCReview  = lazy(() => import('../agent/AgentKYCReview'));

/**
 * Agent role routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const agentRoutes = [
  <Route key="agent-welcome"    path="/agent-welcome"    element={<AgentWelcome />} />,
  <Route key="agent-signup"     path="/agent-signup"     element={<AgentSignup />} />,
  <Route key="agent-agreement"  path="/agent-agreement"  element={<AgentAgreement />} />,
  <Route key="agent-kyc"        path="/agent-kyc"        element={<AgentKYC />} />,
  <Route key="agent-kyc-review" path="/agent-kyc-review" element={<AgentKYCReview />} />,
];
