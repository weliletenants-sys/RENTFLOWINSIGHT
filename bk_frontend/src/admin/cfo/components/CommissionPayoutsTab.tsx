import React, { useState, useEffect } from 'react';
import { Coins, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import axios from 'axios';

interface CommissionPayoutsTabProps {
  commissionsData?: any[];
  fetchCommissions?: () => void;
}

export default function CommissionPayoutsTab({ commissionsData, fetchCommissions }: CommissionPayoutsTabProps) {
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    if (commissionsData) {
      setCommissions(commissionsData);
    }
  }, [commissionsData]);

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/cfo/commissions/${id}/approve`);
      toast.success(`Commission approved`);
      if (fetchCommissions) fetchCommissions();
    } catch (err: any) {
      toast.error(err.response?.data?.title || 'Failed to approve commission');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason (min 10 characters required for audit):');
    if (!reason || reason.length < 10) {
      toast.error('Rejection must include at least 10 characters for the audit log');
      return;
    }
    try {
      await axios.post(`/api/cfo/commissions/${id}/reject`, { reason });
      toast.success(`Commission rejected. Reason logged.`);
      if (fetchCommissions) fetchCommissions();
    } catch (err: any) {
      toast.error(err.response?.data?.title || 'Failed to reject commission');
    }
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-end mb-2">
        <div className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <ShieldAlert size={14} /> Mandatory CFO Sign-off Filter Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commissions.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white border border-dashed border-slate-200 rounded-3xl">
            <Coins className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            No pending commission payouts requiring CFO approval.
          </div>
        ) : (
          commissions.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:border-slate-200">
              {c.status === 'Approved' && (
                <div className="absolute top-0 right-0 bg-green-50 text-green-700 border-l border-b border-green-100 text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-xl z-10 shadow-sm">
                  Approved
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EAE5FF] text-[#6c11d4] rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                    {c.agentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{c.agentName}</p>
                    <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 mt-1 inline-block">{c.id}</p>
                  </div>
                </div>
                {c.provider === 'MTN' ? (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">MTN</span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md">Airtel</span>
                )}
              </div>

              <div className="my-6 text-center bg-slate-50 rounded-2xl py-6 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payout Amount</p>
                <h2 className="text-4xl font-black font-outfit text-slate-900 tracking-tighter">UGX {c.amount.toLocaleString()}</h2>
              </div>

              <div className="px-2 mb-6 text-xs text-slate-600 font-medium space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-400 text-xs">Mobile Money</span>
                   <strong className="text-slate-800 text-sm font-outfit tracking-wide">{c.number}</strong>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-slate-400 text-xs">Requested</span>
                   <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{c.requestedAt}</span>
                </div>
              </div>

              {c.status === 'Pending' ? (
                <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => handleReject(c.id)} className="py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-colors shadow-sm">
                    Reject
                  </button>
                  <button onClick={() => handleApprove(c.id)} className="py-3 text-sm font-bold text-white bg-[#6c11d4] hover:bg-[#5b21b6] rounded-full transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                </div>
              ) : (
                <div className="mt-auto pt-4 text-center">
                  <span className="text-sm font-bold text-green-600 flex items-center justify-center gap-2 bg-green-50 py-2.5 rounded-full border border-green-100">
                    <CheckCircle2 size={16} /> Ready for processing
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
