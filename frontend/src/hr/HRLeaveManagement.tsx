import React, { useState } from 'react';
import { useHRPendingLeave, useApproveLeave } from './hooks/useHRQueries';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function HRLeaveManagement() {
  const { data: requests, isLoading } = useHRPendingLeave();
  const { mutate: approveMutate, isPending } = useApproveLeave();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    setSelectedId(id);
    approveMutate({ id, status, reason: 'Reviewed via HR Dashboard' }, {
      onSettled: () => setSelectedId(null)
    });
  };

  return (
    <ExecutiveDashboardLayout role="hr" title="Leave Management">
      <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground mt-2">Approve or reject pending employee leave.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse mt-8">
            <div className="h-20 bg-muted rounded-xl w-full"></div>
            <div className="h-20 bg-muted rounded-xl w-full"></div>
            <div className="h-20 bg-muted rounded-xl w-full"></div>
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="mt-8 text-center p-12 border-2 border-dashed rounded-xl bg-card">
            <h3 className="text-lg font-medium text-foreground">No Pending Requests</h3>
            <p className="text-muted-foreground mt-1">All employee leave requests have been processed.</p>
          </div>
        ) : (
          <div className="mt-8 bg-card border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{req.user_id?.substring(0, 8) || 'Unknown'}</td>
                    <td className="px-6 py-4 capitalize">{req.leave_type.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      {new Date(req.start_date).toLocaleDateString()} &rarr; {new Date(req.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{req.reason || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        disabled={isPending && selectedId === req.id}
                        onClick={() => handleAction(req.id, 'approved')}
                        className="px-3 py-1.5 bg-primary/10 text-primary font-medium rounded-md hover:bg-primary/20 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button 
                        disabled={isPending && selectedId === req.id}
                        onClick={() => handleAction(req.id, 'rejected')}
                        className="px-3 py-1.5 bg-destructive/10 text-destructive font-medium rounded-md hover:bg-destructive/20 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ExecutiveDashboardLayout>
  );
}
