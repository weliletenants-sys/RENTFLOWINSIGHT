import React, { useState } from 'react';
import { useIssueDisciplinary } from './hooks/useHRQueries';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function HRDisciplinary() {
  const { mutate: issueDisciplinary, isPending } = useIssueDisciplinary();
  const [formData, setFormData] = useState({
    user_id: '',
    type: 'warning',
    severity: 'low',
    description: '',
    evidence_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueDisciplinary(formData, {
      onSuccess: () => {
        setFormData({
          user_id: '',
          type: 'warning',
          severity: 'low',
          description: '',
          evidence_url: ''
        });
      }
    });
  };

  return (
    <ExecutiveDashboardLayout role="hr" title="Disciplinary Controls">
      <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Disciplinary Actions</h1>
          <p className="text-muted-foreground mt-2">Log official warnings, suspensions, and terminations.</p>
        </div>

        <div className="bg-card border-destructive border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-destructive/10 p-4 border-b border-destructive/20">
            <h2 className="font-semibold text-lg text-destructive">Issue Formal Action</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Employee ID</label>
              <input 
                type="text" 
                required
                value={formData.user_id}
                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                placeholder="Staff UUID"
                className="w-full px-4 py-2 border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-destructive/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50"
                >
                  <option value="warning">Official Warning</option>
                  <option value="suspension">Suspension</option>
                  <option value="termination">Termination</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Severity</label>
                <select 
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Detailed Description (Required Audit Trail)</label>
              <textarea 
                required
                minLength={10}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide a mandatory reason (minimum 10 characters)..."
                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50 resize-y"
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Logging...' : 'Issue Formal Action'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
