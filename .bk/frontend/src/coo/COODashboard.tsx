import React from 'react';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function COODashboard() {
  return (
    <ExecutiveDashboardLayout role="coo" title="COO Dashboard">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Health</h1>
          <p className="text-muted-foreground mt-1">Platform-wide orchestration, partner management, and final ops approvals.</p>
        </div>
        
        {/* Simulating 12 tabs from documentation */}
        <div className="flex flex-wrap gap-2 py-4 border-b overflow-x-auto whitespace-nowrap">
          {['Overview', 'Rent Approvals', 'Transactions', 'Collections', 'Wallets', 'Agent Activity', '+ 6 More'].map(tab => (
            <div key={tab} className={`px-4 py-2 rounded-full text-sm font-medium ${tab === 'Overview' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer'}`}>
              {tab}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="h-32 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground text-sm font-medium">Rent Processing Queue</span>
          </div>
          <div className="h-32 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground text-sm font-medium">Active Partners</span>
          </div>
          <div className="h-32 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground text-sm font-medium">Stage 4 Withdrawals</span>
          </div>
          <div className="h-32 bg-card border rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground text-sm font-medium">Agent Defaults</span>
          </div>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
