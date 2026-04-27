import React from 'react';
import { useHROverview } from './hooks/useHRQueries';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function HROverview() {
  const { data, isLoading, error } = useHROverview();

  return (
    <ExecutiveDashboardLayout role="hr" title="HR Dashboard">
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
        <p className="text-muted-foreground">Monitor employee health, payroll, and organizational risks.</p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
            Failed to load HR metrics. Ensure you have proper administrative access.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card shadow-sm border rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
              <p className="text-4xl font-bold text-primary mt-2">{data?.totalEmployees || 0}</p>
            </div>
            
            <div className="bg-card shadow-sm border rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                {data?.pendingLeave > 0 && <span className="flex h-3 w-3 rounded-full bg-amber-500" />}
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Pending Leave</h3>
              <p className="text-4xl font-bold text-foreground mt-2">{data?.pendingLeave || 0}</p>
            </div>

            <div className="bg-card shadow-sm border rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Active Warnings</h3>
              <p className="text-4xl font-bold text-destructive mt-2">{data?.warnings || 0}</p>
            </div>
          </div>
        )}

        {/* Future Quick Nav Grid will be rendered here for routing to sub-tabs */}
        <div className="pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Employees', 'Leave', 'Payroll', 'Disciplinary', 'Audit'].map((tab) => (
              <button 
                key={tab}
                className="p-4 border rounded-lg bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-center font-medium"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

      </div>
    </ExecutiveDashboardLayout>
  );
}
