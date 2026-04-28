import React from 'react';

/**
 * AgentDashboardLayout serves as the context wrapper for Operational/Agent views.
 * It provides standard responsive padding, layout limits, and consistent background handling
 * across the 6 major operations hubs.
 */
export const AgentDashboardLayout: React.FC<{ 
  title: string; 
  children: React.ReactNode 
}> = ({ title, children }) => {
  return (
    <div className="w-full flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0b0f19] relative">
      <div className="w-full flex-1 pb-12">
        {children}
      </div>
    </div>
  );
};
