import React from 'react';
import { ArrowDownToLine, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WithdrawalsTabProps {
  withdrawals: any[];
  fetchWithdrawals: () => void;
}

export default function WithdrawalsTab({ withdrawals, fetchWithdrawals }: WithdrawalsTabProps) {
  
  const handleApprove = async (id: string) => {
    toast.success(`Withdrawal ${id} approved successfully`);
    fetchWithdrawals();
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason (min 10 characters required for audit):');
    if (!reason || reason.length < 10) {
      toast.error('Rejection must include at least 10 characters for the audit log');
      return;
    }
    toast.success('Rejected with reason logged');
    fetchWithdrawals();
  };

  // Mock processing time info logic
  const getProcessedInfo = (status: string) => {
    if (status === 'Approved') {
      return { msg: 'CFO Approved', time: '10 mins ago', by: 'CFO-1' };
    }
    return { msg: 'Manager Approved', time: '2 hrs ago', by: 'MGR-7' };
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-end mb-2">
        <div className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <ShieldAlert size={14} /> Filtering: Pending CFO Review
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!withdrawals || withdrawals.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white border border-dashed border-slate-200 rounded-3xl">
             <ArrowDownToLine className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            No pending withdrawals requiring CFO approval.
          </div>
        ) : withdrawals.map(w => {
          const info = getProcessedInfo(w.status || 'Pending');
          return (
            <div key={w.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md hover:border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EAE5FF] text-[#6c11d4] rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                    {w.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{w.user_name}</p>
                    <p className="text-xs text-slate-500 font-medium">{w.user_phone}</p>
                  </div>
                </div>
                {w.provider === 'MTN' ? (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">MTN</span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md">Airtel</span>
                )}
              </div>

              <div className="my-6 text-center bg-slate-50 rounded-2xl py-6 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                <h2 className="text-4xl font-black font-outfit text-slate-900 tracking-tighter">UGX {(w.amount || 0).toLocaleString()}</h2>
              </div>

              <div className="px-2 mb-6 text-xs text-slate-600 font-medium space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-400">Recipient</span>
                   <strong className="text-slate-800 text-sm font-outfit tracking-wide">{w.recipient_number || w.user_phone}</strong>
                </div>
                {w.reason && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-400">Reason</span>
                     <span className="truncate max-w-[140px] text-slate-700 font-bold" title={w.reason}>{w.reason}</span>
                  </div>
                )}
                
                <div className="pt-2 flex flex-col gap-1.5">
                  <p className="flex justify-between items-center"><span className="text-slate-400 text-[10px]">Status Tracker</span> <span className="text-[#6c11d4] bg-[#EAE5FF] px-2 py-0.5 rounded font-bold text-[10px]">{info.msg}</span></p>
                  <p className="flex justify-between text-[10px]"><span className="text-slate-400">Time Segment</span> <span className="font-bold text-slate-600">{info.time}</span></p>
                  <p className="flex justify-between text-[10px]"><span className="text-slate-400">Processed By</span> <span className="font-bold text-slate-600">{info.by}</span></p>
                </div>
              </div>

              {w.status !== 'Approved' ? (
                <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => handleReject(w.id)} className="py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-colors shadow-sm">
                    Reject
                  </button>
                  <button onClick={() => handleApprove(w.id)} className="py-3 text-sm font-bold text-white bg-[#6c11d4] hover:bg-[#5b21b6] shadow-md shadow-purple-500/20 rounded-full transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                </div>
              ) : (
                <div className="mt-auto pt-4 text-center">
                  <span className="text-sm font-bold text-green-600 flex items-center justify-center gap-2 bg-green-50 py-2.5 rounded-full border border-green-100">
                    <CheckCircle2 size={16} /> Sent to Processing
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
