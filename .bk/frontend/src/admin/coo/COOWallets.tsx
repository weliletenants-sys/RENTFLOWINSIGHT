import React, { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, CheckCircle, ArrowRightLeft, Loader2, AlertTriangle } from 'lucide-react';
import { fetchWallets } from '../../services/cooApi';

interface WalletData {
  id: string;
  balance: number;
  updatedAt: string;
  userName: string;
  role: string;
}

const COOWallets: React.FC = () => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await fetchWallets();
        setWallets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWallets();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading wallet matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Wallets</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate aggregates
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const negativeWallets = wallets.filter(w => w.balance < 0);
  const topWallets = wallets.filter(w => w.balance > 0).slice(0, 5); // Just taking top 5 for "interesting" wallets

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-outfit text-slate-800 mb-1">Wallet Monitoring</h2>
        <p className="text-sm text-slate-500">Track all isolated capital stores and user balances</p>
      </div>

      {/* High-Level System Wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total System Liquidity</p>
              <h3 className="text-3xl font-bold font-outfit text-[#6c11d4]">UGX {totalBalance.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#6c11d4]">
              <Wallet size={24} />
            </div>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-max">
            <CheckCircle size={16} className="mr-2" /> Live Aggregation
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Negative Balances</p>
              <h3 className="text-3xl font-bold font-outfit text-slate-800">{negativeWallets.length} Accounts</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <ArrowRightLeft size={24} />
            </div>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg w-max border border-orange-200">
            <ShieldAlert size={16} className="mr-2" /> {negativeWallets.length > 0 ? 'Requires Immediate Attention' : 'All clear'}
          </div>
        </div>
      </div>

      {/* Anomalous / Important User Wallets */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-md font-bold text-slate-800 flex items-center">
            {negativeWallets.length > 0 ? <ShieldAlert className="text-red-500 mr-2" size={18} /> : <CheckCircle className="text-green-500 mr-2" size={18} />}
            {negativeWallets.length > 0 ? 'Accounts Requiring Attention' : 'Top Wallet Balances'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {negativeWallets.length > 0 
              ? 'Automatically flagged wallets with suspicious activity or negative balances.'
              : 'Largest liquidity pools currently held by users in the system.'}
          </p>
        </div>
        <div className="divide-y divide-slate-100 h-96 overflow-y-auto">
           {negativeWallets.length > 0 ? (
             negativeWallets.map(w => (
               <div key={w.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div>
                    <p className="font-bold text-slate-800">{w.userName}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{w.role}</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="font-bold text-red-600">UGX {w.balance.toLocaleString()}</p>
                    <p className="text-xs text-red-500 font-medium">Negative Float Balance</p>
                 </div>
               </div>
             ))
           ) : (
             topWallets.map(w => (
               <div key={w.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div>
                    <p className="font-bold text-slate-800">{w.userName}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{w.role}</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="font-bold text-[#6c11d4]">UGX {w.balance.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 font-medium">Positive Float</p>
                 </div>
               </div>
             ))
           )}
           {wallets.length === 0 && (
             <div className="p-8 text-center text-slate-500">No active wallets tracked.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default COOWallets;
