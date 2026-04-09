import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function CFOAgentRequisitions() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  
  // Dummy data simulating pending requests awaiting CFO approval
  const [requisitions, setRequisitions] = useState([
    {
      id: 'req-001',
      agentName: 'Akwasi Mensah',
      category: 'Field Operations',
      amount: 150000,
      urgency: 'high',
      description: 'Transport float required for mobilizing 20 new landlords in the Eastern Region today.',
      submittedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'req-002',
      agentName: 'Jane Doe',
      category: 'Marketing & Flyers',
      amount: 80000,
      urgency: 'standard',
      description: 'Printing 500 Welile flyers for the upcoming community town hall event.',
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const handleApprove = (id: string) => {
    setSelectedReq(id);
    setTimeout(() => {
      setRequisitions(prev => prev.filter(req => req.id !== id));
      toast.success('Requisition approved. Funds disbursed to agent wallet.');
      setSelectedReq(null);
    }, 1000);
  };

  const handleReject = (id: string) => {
    setSelectedReq(id);
    setTimeout(() => {
      setRequisitions(prev => prev.filter(req => req.id !== id));
      toast.error('Requisition rejected.');
      setSelectedReq(null);
    }, 1000);
  };

  return (
    <ExecutiveDashboardLayout role="cfo" title="Agent Requisitions">
      <div className="p-4 md:p-8 w-full max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent OPEX Requisitions</h1>
          <p className="text-muted-foreground mt-2">Approve operational fund disbursements directly to authorized financial agents.</p>
        </div>

        {requisitions.length === 0 ? (
          <div className="mt-8 text-center p-12 border-2 border-dashed rounded-xl bg-card">
            <h3 className="text-lg font-medium text-foreground">Inbox Zero</h3>
            <p className="text-muted-foreground mt-1">There are no pending operational requisitions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {requisitions.map((req) => (
              <div key={req.id} className="bg-card border rounded-xl flex flex-col shadow-sm">
                <div className={`p-4 border-b flex justify-between items-center ${
                  req.urgency === 'high' ? 'bg-amber-500/10 border-amber-500/20' : 
                  req.urgency === 'critical' ? 'bg-destructive/10 border-destructive/20' : 'bg-muted'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    req.urgency === 'high' ? 'text-amber-600' : 
                    req.urgency === 'critical' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {req.urgency} Priority
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>
                
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{req.agentName}</h3>
                      <p className="text-sm font-medium text-primary">{req.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono">UGX {req.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg text-sm text-foreground/80 font-serif italic border border-muted">
                    "{req.description}"
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between gap-3 bg-muted/20">
                  <button 
                    disabled={selectedReq === req.id}
                    onClick={() => handleReject(req.id)}
                    className="flex-1 px-4 py-2 bg-card text-destructive font-medium border border-destructive/30 rounded-lg hover:bg-destructive hover:text-white transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button 
                    disabled={selectedReq === req.id}
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Disburse Cash
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ExecutiveDashboardLayout>
  );
}
