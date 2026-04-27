import React, { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, Smartphone, CreditCard, Banknote, Loader2, AlertTriangle } from 'lucide-react';
import { fetchCollections } from '../../services/cooApi';

interface Collection {
  id: string;
  agentName: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

const COOCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading field operations data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Collections</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const totalToday = collections.reduce((acc, col) => acc + col.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Agent Collections</h2>
          <p className="text-sm text-slate-500">Daily reconciliation and performance tracking</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Operations Amount</p>
            <p className="text-xl font-bold text-[#6c11d4]">UGX {totalToday.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c11d4] focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Agent</th>
                <th className="p-4 font-semibold">Amount Collected</th>
                <th className="p-4 font-semibold">Payment Method</th>
                <th className="p-4 font-semibold">Notes</th>
                <th className="p-4 font-semibold">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DBFC]">
              {collections.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No collections logged yet.</td>
                 </tr>
              ) : collections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{col.agentName}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <MapPin size={12} className="mr-1" /> {new Date(col.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#6c11d4] text-lg">UGX {col.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-600 font-bold uppercase">
                        {col.paymentMethod === 'MOBILE_MONEY' && <><Smartphone size={12} className="mr-2 text-yellow-500" /> Mobile Money</>}
                        {col.paymentMethod === 'CASH' && <><Banknote size={12} className="mr-2 text-green-500" /> Cash</>}
                        {col.paymentMethod === 'BANK' && <><CreditCard size={12} className="mr-2 text-blue-500" /> Bank</>}
                        {!['MOBILE_MONEY', 'CASH', 'BANK'].includes(col.paymentMethod) && <><CreditCard size={12} className="mr-2 text-slate-500" /> {col.paymentMethod}</>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                     {col.notes || 'None'}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-green-600 flex items-center font-medium">
                        <TrendingUp size={12} className="mr-1" /> Logged
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COOCollections;
