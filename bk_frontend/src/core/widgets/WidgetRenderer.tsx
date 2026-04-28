import { Suspense } from 'react';
import { WIDGET_REGISTRY } from './WidgetRegistry';
import { WIDGET_PERMISSIONS } from '../../config/widgetMap';
import { usePermissions } from '../hooks/usePermissions';

interface WidgetRendererProps {
  widgets: string[];
}

export function WidgetRenderer({ widgets }: WidgetRendererProps) {
  const { can } = usePermissions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Suspense fallback={<div className="h-32 rounded-xl bg-muted/20 animate-pulse" />}>
        {widgets.map((key) => {
          const Component = WIDGET_REGISTRY[key];
          
          // Fallback if widget not registered
          if (!Component) return null;
          
          // Securely check if user has permission to render this specific widget
          const requiredPermissions = WIDGET_PERMISSIONS[key];
          if (requiredPermissions && !can(requiredPermissions)) {
            return null; // Silently drop unauthorized widgets
          }

          return <Component key={key} />;
        })}
      </Suspense>
    </div>
  );
}
