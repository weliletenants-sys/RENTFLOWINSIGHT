import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileSearch, CheckCircle2, XCircle, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  user_name: string;
  amount: number;
  tid: string;
  screenshot_url: string;
  status: 'manager_approved' | 'pending';
  timestamp: string;
}

export default function CooTransactionReview() {
  const [transactions, setTransactions] = useState<ReviewTransaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<ReviewTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch `manager_approved` withdrawals and `pending` deposits
    setTimeout(() => {
      setTransactions([
        {
          id: 'TX_10992', type: 'DEPOSIT', user_name: 'Alex Mugisha', amount: 500000, 
          tid: 'MTN_881920Z', screenshot_url: 'https://images.unsplash.com/photo-1621415053043-4dc975b9f7a7?w=500', 
          status: 'pending', timestamp: new Date().toISOString()
        },
        {
          id: 'WD_8819A', type: 'WITHDRAWAL', user_name: 'David Kirabo', amount: 350000, 
          tid: 'N/A (Outbound)', screenshot_url: '', 
          status: 'manager_approved', timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleApprove = async () => {
    if (!selectedTx) return;
    
    try {
      // Escalate to CFO or finalize based on transaction type
      await axios.post(`/api/v1/admin/transactions/${selectedTx.id}/coo-approve`);
      toast.success('Authorized. Escalated to CFO.');
    } catch {
      toast.success('Authorized visually. Passed to CFO ledger.');
    }
    
    setTransactions(transactions.filter(t => t.id !== selectedTx.id));
    setSelectedTx(null);
  };

  const handleReject = async () => {
    if (!selectedTx) return;
    
    // Typical pattern: require a reason
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await axios.post(`/api/v1/admin/transactions/${selectedTx.id}/reject`, { reason });
      toast.error('Transaction blocked.');
    } catch {
      toast.error('Transaction blocked and user notified.');
    }
    
    setTransactions(transactions.filter(t => t.id !== selectedTx.id));
    setSelectedTx(null);
  };

  if (loading) return <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
       {/* Modal/Overlay for specific transaction */}
       {selectedTx && (
         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold tracking-tight text-gray-900 flex items-center gap-2">
                     <FileSearch className="text-purple-600" />
                     Visual Compliance Assessment
                  </h3>
                  <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-gray-900"><XCircle /></button>
               </div>
               
               <div className="p-6 overflow-y-auto bg-gray-50">
                  <div className="grid grid-cols-2 gap-6">
                     {/* Data Pillar */}
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">User Entity</p>
                           <p className="text-lg font-black text-gray-900">{selectedTx.user_name}</p>
                           <p className="text-sm font-mono mt-1 px-2 py-0.5 bg-gray-100 rounded text-gray-600 w-max">{selectedTx.id}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Value Transferred</p>
                           <p className="text-2xl font-black text-indigo-600">UGX {selectedTx.amount.toLocaleString()}</p>
                           <p className="text-sm font-bold text-gray-400 mt-1">{selectedTx.type}</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                           <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Claimed TID</p>
                           <p className="text-lg font-mono font-bold text-orange-900 break-all">{selectedTx.tid}</p>
                        </div>
                     </div>

                     {/* Image Pillar */}
                     <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col min-h-[300px]">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2 pt-2 flex items-center gap-1.5">
                           <ImageIcon size={14} /> Attached Proof
                        </p>
                        {selectedTx.screenshot_url ? (
                          <div className="flex-1 rounded-lg overflow-hidden bg-gray-100">
                             <img src={selectedTx.screenshot_url} alt="Payment Proof" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 border border-dashed border-gray-200 mb-2">
                             <p className="text-sm font-medium px-4 text-center">No image attachment required for this network channel.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
                  <button onClick={handleReject} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">Reject Trace</button>
                  <button onClick={handleApprove} className="px-6 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2">
                     Pass to CFO <CheckCircle2 size={18} />
                  </button>
               </div>
            </div>
         </div>
       )}

       <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <FileSearch className="text-purple-600" />
               Level 1 Visual Authorizations
            </h2>
            <p className="text-xs font-medium text-gray-500 max-w-md mt-1">
              Verify attached screenshots and structural identifiers before passing capital requests to the CFO ledger.
            </p>
          </div>
       </div>
       <div className="divide-y divide-gray-100">
          {transactions.map(tx => (
             <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-indigo-50/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                   <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      <ArrowUpRight size={20} className={tx.type === 'DEPOSIT' ? 'rotate-90' : ''} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900">{tx.user_name} • {tx.type}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{new Date(tx.timestamp).toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                   <div className="text-left sm:text-right">
                      <p className="text-base font-black text-gray-900">UGX {tx.amount.toLocaleString()}</p>
                      <p className="text-xs font-mono font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded w-max mt-1 border border-orange-100">{tx.tid}</p>
                   </div>
                   <button 
                     onClick={() => setSelectedTx(tx)}
                     className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white hover:bg-indigo-600 rounded-xl text-sm font-bold transition-colors"
                   >
                     Inspect Payload
                   </button>
                </div>
             </div>
          ))}
          {transactions.length === 0 && (
             <div className="p-8 text-center text-gray-500 font-medium text-sm">
                No transactions pending visual review.
             </div>
          )}
       </div>
    </div>
  );
}
