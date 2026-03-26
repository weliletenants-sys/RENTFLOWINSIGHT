import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  // FRONTEND DEV OVERRIDE: Disabled all route guards so every page is accessible
  if (!user) {
    // Check if the requested route is a system/executive dashboard
    const isAdminRoute = location.pathname.startsWith('/admin') || 
                         location.pathname.startsWith('/ceo') || 
                         location.pathname.startsWith('/coo') || 
                         location.pathname.startsWith('/cfo') ||
                         location.pathname.startsWith('/crm');
                         
    if (isAdminRoute) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Default: Not logged in, redirect to consumer login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, but no role is selected, force redirection to role selection.
  if (!user.role && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  // Render children components or nested routes via React Router's Outlet
  return children ? <>{children}</> : <Outlet />;
}
