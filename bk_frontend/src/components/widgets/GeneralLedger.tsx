import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, TrendingUp, TrendingDown, Search, Download, Filter } from 'lucide-react';

export default function GeneralLedgerWidget() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/cfo/ledger', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLedger(data.ledger || []);
    } catch (err: any) {
      toast.error('Failed to sync master ledger');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'deposit': return 'bg-green-100 text-green-700 border-green-200';
      case 'withdrawal': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'platform_fee': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'transfer': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'commission': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-[#6c11d4]" /> Master General Ledger
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Immutable record of all platform value movements.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search references..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#6c11d4] bg-white w-48 transition-all" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6c11d4] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#5b21b6]">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100 sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="px-6 py-4">Timestamp Sequence</th>
              <th className="px-6 py-4">Reference ID</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount Impact</th>
              <th className="px-6 py-4 text-right">Running Bal.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
               <tr><td colSpan={5} className="px-6 py-12 text-center text-sm font-bold text-slate-400">Syncing cryptographic ledger...</td></tr>
            ) : ledger.length === 0 ? (
               <tr><td colSpan={5} className="px-6 py-12 text-center text-sm font-bold text-slate-400">No ledger entities found.</td></tr>
            ) : ledger.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-slate-500 font-medium">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-slate-700 block">{entry.reference_id || entry.id}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">{entry.description || 'System Entry'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${getCategoryColor(entry.category)}`}>
                    {entry.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {entry.direction === 'credit' ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-orange-500" />
                    )}
                    <span className={`font-mono text-sm font-black ${entry.direction === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                      {entry.direction === 'credit' ? '+' : '-'} UGX {entry.amount.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm font-bold text-slate-400">
                  {entry.running_balance ? `UGX ${entry.running_balance.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
