import { lazy } from 'react';
import { Route } from 'react-router-dom';

const LandingPage    = lazy(() => import('../pages/LandingPage'));
const WelcomePage    = lazy(() => import('../pages/WelcomePage'));
const Login          = lazy(() => import('../pages/auth/Login'));
const Signup         = lazy(() => import('../pages/auth/Signup'));
const RoleSelection  = lazy(() => import('../pages/auth/RoleSelection'));

/**
 * Public / shared routes — all pages are lazy-loaded.
 * Exported as a JSX array so React Router v6 can see each <Route> directly.
 */
export const publicRoutes = [
  <Route key="home"          path="/"              element={<LandingPage />} />,
  <Route key="welcome"       path="/welcome"       element={<WelcomePage />} />,
  <Route key="role-selection" path="/role-selection" element={<RoleSelection />} />,
  <Route key="login"         path="/login"         element={<Login />} />,
  <Route key="signup"        path="/signup"        element={<Signup />} />,
];
