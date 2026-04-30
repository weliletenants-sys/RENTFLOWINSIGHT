import React from 'react';
import { ExecutiveDashboardLayout } from '../../components/layout/ExecutiveDashboardLayout';

export default function FinancialOpsCommandCenter() {
  return (
    <ExecutiveDashboardLayout role="financial_ops" title="Financial Ops Command">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deposit & Withdrawal Queue</h1>
          <p className="text-muted-foreground mt-1">High-velocity verification of transaction IDs and mobile money statements.</p>
        </div>
        
        {/* Real-time pulse strip */}
        <div className="bg-slate-900 border-slate-800 border rounded-xl p-4 flex items-center justify-between shadow-md">
           <div className="flex items-center gap-2">
             <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-slate-200 font-mono text-sm">System Normal: Processing 4 transactions/m</span>
           </div>
           <span className="text-slate-400 font-mono text-sm">Escrow Buffer: UGX 15,200,500</span>
        </div>

        <div className="flex border-b pt-4 overflow-x-auto whitespace-nowrap">
          <div className="px-6 py-3 border-b-2 border-primary text-primary font-bold bg-primary/5 rounded-t-lg">
            TID Verification
          </div>
          <div className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground cursor-pointer">
            Withdrawal Approvals
          </div>
          <div className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground cursor-pointer">
            Failed Transactions
          </div>
        </div>

        <div className="mt-8 p-12 bg-card border-2 border-dashed border-primary/20 rounded-xl text-center">
          <h3 className="text-lg font-bold text-foreground">Awaiting Receipt IDs</h3>
          <p className="text-muted-foreground mt-1">Enter MTN/Airtel TID to auto-match pending deposits.</p>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
