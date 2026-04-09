import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AgentRequisitionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'ops_expense',
    description: '',
    urgency: 'standard'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Stubbed submission to React Query / Axios
    setTimeout(() => {
      toast.success('Funds requisition submitted to CFO queue.');
      setIsSubmitting(false);
      setFormData({ amount: '', category: 'ops_expense', description: '', urgency: 'standard' });
    }, 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-primary">Operational Requisition</h2>
        <p className="text-sm text-primary/80 mt-1">Request explicit platform funds for marketing or field operations. Subject to CFO authorization.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card shadow-sm border rounded-xl overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Requested Amount (UGX)</label>
            <input 
              type="number" 
              required
              min="5000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">P&L Expense Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="ops_expense">Field Operations</option>
                <option value="marketing_expense">Marketing & Flyers</option>
                <option value="agent_recruitment">Sub-Agent Recruitment</option>
                <option value="office_supplies">Office & Stationeries</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Urgency Level</label>
              <select 
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="standard">Standard (Next Batch)</option>
                <option value="high">High (Today)</option>
                <option value="critical">Critical (Immediate)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Business Case / Reason</label>
            <textarea 
              required
              minLength={10}
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Why are these funds required currently?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 border-t flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Send Requisition'}
          </button>
        </div>
      </form>
    </div>
  );
}
