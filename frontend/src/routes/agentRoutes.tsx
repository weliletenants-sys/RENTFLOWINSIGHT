import { Route } from 'react-router-dom';
import AgentWelcome from '../agent/AgentWelcome';
import AgentSignup from '../agent/AgentSignup';
import AgentAgreement from '../agent/AgentAgreement';
import AgentKYC from '../agent/AgentKYC';
import AgentKYCReview from '../agent/AgentKYCReview';

/**
 * Agent role routes.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const agentRoutes = [
  <Route key="agent-welcome" path="/agent-welcome" element={<AgentWelcome />} />,
  <Route key="agent-signup" path="/agent-signup" element={<AgentSignup />} />,
  <Route key="agent-agreement" path="/agent-agreement" element={<AgentAgreement />} />,
  <Route key="agent-kyc" path="/agent-kyc" element={<AgentKYC />} />,
  <Route key="agent-kyc-review" path="/agent-kyc-review" element={<AgentKYCReview />} />,
];
