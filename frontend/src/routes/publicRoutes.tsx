import { Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import WelcomePage from '../pages/WelcomePage';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import RoleSelection from '../pages/auth/RoleSelection';

/**
 * Public / shared routes.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const publicRoutes = [
  <Route key="home" path="/" element={<LandingPage />} />,
  <Route key="welcome" path="/welcome" element={<WelcomePage />} />,
  <Route key="role-selection" path="/role-selection" element={<RoleSelection />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="signup" path="/signup" element={<Signup />} />,
];
