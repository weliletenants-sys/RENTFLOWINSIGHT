import React, { useState, useEffect } from 'react';
import { Search, XCircle, Loader2, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPendingDeposits, forwardDeposit, rejectDeposit } from '../../services/cooApi';

interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  provider: string;
  transaction_id: string;
  user_name?: string;
  user_phone?: string;
}

const COODeposits: React.FC = () => {
  const [filter, setFilter] = useState('PENDING');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const data = await getPendingDeposits();
        setDeposits(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDeposits();
  }, []);

  const filteredData = deposits.filter(d => filter === 'All' || d.status === filter);

  const handleAction = async (id: string, action: 'Forward' | 'Reject') => {
    try {
      if (action === 'Forward') {
        await forwardDeposit(id);
        toast.success(`Deposit ${id} verified and forwarded to CFO`);
      } else {
        const reason = prompt('Rejection reason (min 10 characters required for audit):');
        if (!reason || reason.length < 10) {
          toast.error('Rejection must include at least 10 characters for the audit log');
          return;
        }
        await rejectDeposit(id, reason);
        toast.success('Deposit rejected with reason logged');
      }
      
      // Optimistic UI update
      setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: action === 'Forward' ? 'COO_APPROVED' : 'REJECTED' } : d));
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} deposit`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Checking pending deposit queues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Deposits</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Deposit Verifications</h2>
          <p className="text-sm text-slate-500 font-medium">First Layer Operations: Verify incoming deposits</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          {['All', 'PENDING', 'COO_APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === status 
                  ? 'bg-white shadow-sm text-[#6c11d4]' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by User or TID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c11d4] focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Channel & TID</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{d.user_name || 'N/A'}</p>
                    <p className="text-xs text-slate-500">{d.user_phone}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(d.created_at).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {d.provider === 'MTN' || d.provider === 'mtn' ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded">MTN</span>
                        ) : d.provider === 'Airtel' || d.provider === 'airtel' ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">AIRTEL</span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">{d.provider || 'BANK'}</span>
                        )}
                    </div>
                    <p className="font-mono text-xs text-slate-600 mt-1.5 font-bold tracking-tight">
                      {d.transaction_id || 'N/A'}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">UGX {d.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${d.status === 'PENDING' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                        d.status === 'COO_APPROVED' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                        d.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                        'bg-red-100 text-red-800 border border-red-200'}`
                    }>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {d.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleAction(d.id, 'Reject')}
                          className="flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                          title="Reject"
                        >
                           <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction(d.id, 'Forward')}
                          className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#6c11d4] text-white hover:bg-[#5b21b6] transition-colors text-xs font-bold shadow-md shadow-purple-500/20"
                          title="Forward to CFO"
                        >
                           Forward <ArrowRightCircle size={14} className="ml-1.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No deposits match the selected queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COODeposits;
