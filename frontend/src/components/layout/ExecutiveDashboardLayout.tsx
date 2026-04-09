import React from 'react';

/**
 * ExecutiveDashboardLayout serves as the standard context wrapper for Executive views.
 * It is embedded within the primary ExecutiveLayout outlet, so this component primarily 
 * handles specific internal padding, page titles, and any global executive-level toast or state providers.
 */
export const ExecutiveDashboardLayout: React.FC<{ 
  role?: string; 
  title: string; 
  children: React.ReactNode 
}> = ({ title, children }) => {
  return (
    <div className="w-full flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#0b0f19]">
      {/* Optional internal header/breadcrumbs could go here. For now, it respects the global ExecutiveLayout */}
      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  );
};
