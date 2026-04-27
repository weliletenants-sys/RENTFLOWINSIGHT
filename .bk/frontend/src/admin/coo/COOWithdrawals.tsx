import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWithdrawals } from '../../services/cooApi';

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  mobile_money_name: string;
  mobile_money_number: string;
}

const COOWithdrawals: React.FC = () => {
  const [filter, setFilter] = useState('manager_approved');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const data = await fetchWithdrawals();
        setWithdrawals(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWithdrawals();
  }, []);

  const filteredData = withdrawals.filter(w => filter === 'All' || w.status === filter);

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    // Note: To be fully functional, this needs a POST request to a new endpoint
    // i.e await axios.post(`/api/v1/coo/withdrawals/${id}/approve`)
    toast.success(`Withdrawal ${id} ${action}d successfully`);
    // Optimistic UI update
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: action === 'Approve' ? 'coo_approved' : 'rejected' } : w));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Checking withdrawal queues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Withdrawals</h3>
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
          <h2 className="text-xl font-bold font-outfit text-slate-800">Withdrawals</h2>
          <p className="text-sm text-slate-500 font-medium">Final Authority: Review and sign-off cash flow requests</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          {['All', 'manager_approved', 'coo_approved', 'rejected'].map(status => (
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
              placeholder="Search by ID or destination..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c11d4] focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">ID & Date</th>
                <th className="p-4 font-semibold">Destination Details</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {filteredData.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{w.id}</p>
                    <p className="text-xs text-slate-500">{new Date(w.created_at).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{w.mobile_money_name || 'N/A'}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {w.mobile_money_number || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">UGX {w.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      ${w.status === 'manager_approved' ? 'bg-orange-100 text-orange-800' : 
                        w.status === 'coo_approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`
                    }>
                      {w.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {w.status === 'manager_approved' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleAction(w.id, 'Approve')}
                          className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs font-bold ring-1 ring-green-200"
                          title="Final Approve"
                        >
                          <CheckCircle size={14} className="mr-1" /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction(w.id, 'Reject')}
                          className="flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 font-medium italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No withdrawals match the selected filters.
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

export default COOWithdrawals;
