import { WidgetRenderer } from '../../core/widgets/WidgetRenderer';
import { getWidgetsForUser } from '../../core/utils/widgetResolver';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function StaffPortal() {
  const { user } = useAuth();
  
  // RLS Hard Check at the Portal Boundary 
  const isConsumerRolesOnly = !user || !['MANAGER', 'CEO', 'COO', 'CFO', 'CTO', 'CMO', 'CRM', 'SUPER_ADMIN', 'ADMIN'].includes(user.role as string);

  if (isConsumerRolesOnly) {
    // Immediate bounce back to consumer dashboard if unauthorized
    return <Navigate to="/dashboard" replace />;
  }

  const widgets = getWidgetsForUser();

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Staff Portal
          </h1>
          <p className="text-muted-foreground text-lg">
            Unified administrative system.
          </p>
        </div>
        
        {/* The Adaptive Engine */}
        <WidgetRenderer widgets={widgets} />
      </div>
    </DashboardLayout>
  );
}
