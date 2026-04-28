import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface CFODepositsTabProps {
  deposits: any[];
  fetchDeposits: () => void;
}

export default function CFODepositsTab({ deposits, fetchDeposits }: CFODepositsTabProps) {
  
  const handleApprove = async (id: string) => {
    try {
      await axios.put(`/api/cfo/deposits/${id}/approve`);
      toast.success(`Deposit ${id} fully verified & ledger credited!`);
      fetchDeposits();
    } catch (err: any) {
      toast.error('Failed to approve deposit: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (_id: string) => {
    // Basic mock rejection logic since CFO rejection endpoint doesn't strictly exist for deposits yet,
    // assuming we route it to a rejection block if needed, or notify COO
    toast.error('Rejecting deposits feature at CFO level is pending escalation routing.');
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-end mb-2">
        <div className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <ShieldAlert size={14} /> Stage: CFO Final Confirmation
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!deposits || deposits.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white border border-dashed border-slate-200 rounded-3xl">
             <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            No deposits pending CFO confirmation. The queue is clear!
          </div>
        ) : deposits.map(d => {
          return (
            <div key={d.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md hover:border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EAE5FF] text-[#6c11d4] rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                    {d.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{d.user_name}</p>
                    <p className="text-xs text-slate-500 font-medium">{d.user_phone}</p>
                  </div>
                </div>
                {d.provider === 'MTN' || d.provider === 'mtn' ? (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">MTN</span>
                ) : d.provider === 'Airtel' || d.provider === 'airtel' ? (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md">AIRTEL</span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-center max-w-[60px] leading-tight truncate">{d.provider || 'BANK'}</span>
                )}
              </div>

              <div className="my-6 text-center bg-slate-50 rounded-2xl py-6 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Deposit Amount</p>
                <h2 className="text-4xl font-black font-outfit text-slate-900 tracking-tighter">UGX {(d.amount || 0).toLocaleString()}</h2>
              </div>

              <div className="px-2 mb-6 text-xs text-slate-600 font-medium space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-400">Transaction ID</span>
                   <strong className="text-slate-800 text-sm font-outfit tracking-wide">{d.transaction_id || 'N/A'}</strong>
                </div>
                {d.notes && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-400">Notes</span>
                     <span className="truncate max-w-[140px] text-slate-700 font-bold" title={d.notes}>{d.notes}</span>
                  </div>
                )}
                
                <div className="pt-2 flex flex-col gap-1.5">
                  <p className="flex justify-between items-center"><span className="text-slate-400 text-[10px]">Security Status</span> <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-100">COO Verified</span></p>
                  <p className="flex justify-between text-[10px]"><span className="text-slate-400">First Layer Ops</span> <span className="font-bold text-slate-600">Operations Desk</span></p>
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => handleReject(d.id)} className="py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-colors shadow-sm">
                  Decline
                </button>
                <button onClick={() => handleApprove(d.id)} className="py-3 text-sm font-bold text-white bg-[#6c11d4] hover:bg-[#5b21b6] shadow-md shadow-purple-500/20 rounded-full transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Confirm
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
