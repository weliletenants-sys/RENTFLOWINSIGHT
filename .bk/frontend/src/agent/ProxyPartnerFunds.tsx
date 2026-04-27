import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProxyPartnerFunds() {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  // Stub data demonstrating proxy partner assignments mapped to agent
  const [partnerPayouts, setPartnerPayouts] = useState([
    {
      assignmentId: 'px-001',
      partnerName: 'Hon. Osei Tutu',
      portfolioCode: 'WPF-9921',
      pendingPayout: 2500000,
      dueDate: new Date().toISOString(),
      location: 'Kumasi Metropolitan',
      status: 'Ready for Delivery'
    },
    {
      assignmentId: 'px-002',
      partnerName: 'Dr. Mensah',
      portfolioCode: 'WPF-4428',
      pendingPayout: 1200000,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      location: 'Accra Central',
      status: 'Pending Float Withdrawal'
    }
  ]);

  const handleConfirmDelivery = (id: string, name: string) => {
    setSelectedPartner(id);
    setTimeout(() => {
      setPartnerPayouts(prev => prev.filter(p => p.assignmentId !== id));
      toast.success(`Successfully recorded offline delivery for ${name}`);
      setSelectedPartner(null);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-primary border border-primary/20 p-6 rounded-xl text-primary-foreground shadow-md">
        <h2 className="text-2xl font-bold">Proxy Payouts Hub</h2>
        <p className="text-primary-foreground/80 mt-2 max-w-2xl">
          Manage physical cash deliveries to your assigned high-net-worth investors. 
          You must verify the partner's identity upon delivery to drop the deterministic validation cryptographic hash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnerPayouts.map((payout) => (
          <div key={payout.assignmentId} className="bg-card shadow-sm border rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/40 flex justify-between items-center">
              <span className="font-mono text-xs text-muted-foreground">{payout.portfolioCode}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                payout.status === 'Ready for Delivery' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {payout.status}
              </span>
            </div>
            
            <div className="p-6 flex-1 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Assigned Partner</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{payout.partnerName}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  📍 {payout.location}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Pending ROI Delivery</p>
                <p className="text-3xl font-mono font-bold text-primary mt-1">
                  UGX {(payout.pendingPayout).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {new Date(payout.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/20 border-t">
              <button
                disabled={payout.status !== 'Ready for Delivery' || selectedPartner === payout.assignmentId}
                onClick={() => handleConfirmDelivery(payout.assignmentId, payout.partnerName)}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedPartner === payout.assignmentId ? 'Verifying Identity Hash...' : 'Confirm Delivery & Record'}
              </button>
            </div>
          </div>
        ))}

        {partnerPayouts.length === 0 && (
          <div className="col-span-full mt-8 text-center p-12 border-2 border-dashed rounded-xl bg-card">
            <h3 className="text-lg font-medium text-foreground">No Pending Deliveries</h3>
            <p className="text-muted-foreground mt-1">You have delivered all physical ROI allocations for your assigned partners.</p>
          </div>
        )}
      </div>
    </div>
  );
}
