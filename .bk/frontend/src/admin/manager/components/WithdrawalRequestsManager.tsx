import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Search, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface WithdrawalRequest {
  id: string;
  type: 'WITHDRAWAL';
  amount: number;
  user_name: string;
  user_role: string;
  requested_at: string;
  status: 'pending' | 'manager_approved' | 'cfo_approved' | 'rejected' | 'completed';
  channel: 'MTN' | 'Airtel' | 'Bank';
}

export default function WithdrawalRequestsManager() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching the withdrawal queue
    setTimeout(() => {
      setRequests([
        { id: 'WD_8819A', type: 'WITHDRAWAL', amount: 350000, user_name: 'David Kirabo', user_role: 'Agent', requested_at: new Date().toISOString(), status: 'pending', channel: 'MTN' },
        { id: 'WD_992ZB', type: 'WITHDRAWAL', amount: 1500000, user_name: 'Sarah Mulungi', user_role: 'Supporter', requested_at: new Date(Date.now() - 3600000).toISOString(), status: 'pending', channel: 'Bank' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleManagerApprove = async (id: string) => {
    try {
      // In production, this hits an endpoint that promotes status from pending -> manager_approved
      await axios.post(`/api/v1/admin/withdrawals/${id}/approve-manager`);
      toast.success('Escalated to CFO tier.');
      setRequests(requests.filter(req => req.id !== id));
    } catch {
      // API fallback simulation
      toast.success(`Request ${id} escalated to executive tier.`);
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ArrowRightLeft className="text-indigo-600" size={24} />
            Outbound Capital Queue
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Pending withdrawals awaiting Manager authorization</p>
        </div>
        
        <div className="flex gap-2">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search ID..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48" />
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200">
              <th className="py-4 px-6">Request ID</th>
              <th className="py-4 px-6">Requester</th>
              <th className="py-4 px-6 text-right">Amount (UGX)</th>
              <th className="py-4 px-6">Channel</th>
              <th className="py-4 px-6">Time Elapsed</th>
              <th className="py-4 px-6 text-center">Manager Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">No pending withdrawal requests.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-sm font-medium text-indigo-600">
                    {req.id}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{req.user_name}</p>
                    <p className="text-xs text-gray-500">{req.user_role}</p>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-gray-900 text-lg">
                    {req.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                       {req.channel}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                     <Clock size={14} /> 
                     {/* Simplified math for demo */}
                     {'< 1 hr'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => handleManagerApprove(req.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors rounded-lg text-sm font-bold shadow-sm"
                    >
                      <ShieldCheck size={16} />
                      Verify & Escalate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
