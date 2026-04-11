import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFunderEventStream } from '../funder/hooks/useFunderEventStream';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  // Establish SSE background connection for active funders
  useFunderEventStream();

  const isFunderRoute = location.pathname.startsWith('/funder');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!user) {
    if (isAdminRoute) return <Navigate to="/admin/login" replace />;
    if (isFunderRoute) return <Navigate to="/funder/login" replace />;
    return <Navigate to="/login" replace />;
  }

  // Cross-Domain Role Restrictions
  if (user) {
    const administrativeRoles = ['SUPER_ADMIN', 'CEO', 'CFO', 'COO', 'ADMIN', 'CMO', 'CTO', 'CRM', 'MANAGER'];
    
    // Prevent non-admins from rendering admin routes
    if (isAdminRoute && !administrativeRoles.includes(user.role)) {
      return <Navigate to="/admin/login" replace />;
    }
    
    // Prevent non-funders from rendering funder routes (unless Super Admin)
    if (isFunderRoute && user.role !== 'FUNDER' && user.role !== 'SUPER_ADMIN') {
      return <Navigate to="/funder/login" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
