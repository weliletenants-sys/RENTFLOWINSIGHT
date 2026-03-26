import { WidgetRenderer } from '../../core/widgets/WidgetRenderer';
import { getWidgetsForUser } from '../../core/utils/widgetResolver';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdaptiveConsumerDashboard() {
  const { user } = useAuth();
  
  // Boundary check: Staff shouldn't be here, they go to /staff
  if (user?.role === 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const isConsumer = user && ['TENANT', 'AGENT', 'LANDLORD', 'FUNDER'].includes(user.role as string);

  if (!isConsumer) {
    return <Navigate to="/staff" replace />;
  }

  const widgets = getWidgetsForUser();

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.firstName || 'User'}
          </h1>
          <p className="text-slate-500 text-lg">
            Here's what is happening with your account today.
          </p>
        </div>
        
        {/* The Adaptive Engine */}
        <WidgetRenderer widgets={widgets} />
      </div>
    </DashboardLayout>
  );
}
