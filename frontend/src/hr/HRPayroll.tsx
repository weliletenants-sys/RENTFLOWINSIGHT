import React, { useState } from 'react';
import { useSubmitPayroll } from './hooks/useHRQueries';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function HRPayroll() {
  const { mutate: submitPayroll, isPending } = useSubmitPayroll();
  const [formData, setFormData] = useState({
    batch_name: '',
    period_start: '',
    period_end: '',
    total_amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPayroll({
      ...formData,
      total_amount: parseFloat(formData.total_amount)
    }, {
      onSuccess: () => {
        setFormData({ batch_name: '', period_start: '', period_end: '', total_amount: '' });
      }
    });
  };

  return (
    <ExecutiveDashboardLayout role="hr" title="Payroll Processing">
      <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Batches</h1>
          <p className="text-muted-foreground mt-2">Draft and submit payroll periods for CFO approval.</p>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted p-4 border-b">
            <h2 className="font-semibold text-lg">New Payroll Submission</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Batch Name</label>
              <input 
                type="text" 
                required
                value={formData.batch_name}
                onChange={(e) => setFormData({...formData, batch_name: e.target.value})}
                placeholder="e.g., April 2026 Regular Payroll"
                className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Period Start</label>
                <input 
                  type="date" 
                  required
                  value={formData.period_start}
                  onChange={(e) => setFormData({...formData, period_start: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Period End</label>
                <input 
                  type="date" 
                  required
                  value={formData.period_end}
                  onChange={(e) => setFormData({...formData, period_end: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Total Batch Amount (UGX)</label>
              <input 
                type="number" 
                required
                min="0"
                step="1000"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                placeholder="5000000"
                className="w-full px-4 py-2 border rounded-lg bg-background text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">This amount will be transferred from the Operations pool upon CFO approval.</p>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Submitting...' : 'Submit to CFO Route'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
