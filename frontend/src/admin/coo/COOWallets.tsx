import React from 'react';
import { Wallet, ShieldAlert, CheckCircle, ArrowRightLeft } from 'lucide-react';

const COOWallets: React.FC = () => {
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
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Platform Reserve</p>
              <h3 className="text-3xl font-bold font-outfit text-[#7B61FF]">UGX 85.2M</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EAE5FF] flex items-center justify-center text-[#7B61FF]">
              <Wallet size={24} />
            </div>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-max">
            <CheckCircle size={16} className="mr-2" /> Optimal Liquidity
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Disbursal Escrow</p>
              <h3 className="text-3xl font-bold font-outfit text-slate-800">UGX 1.4M</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <ArrowRightLeft size={24} />
            </div>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg w-max border border-orange-200">
            <ShieldAlert size={16} className="mr-2" /> Low Balance Warning
          </div>
        </div>
      </div>

      {/* Anomalous User Wallets */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-md font-bold text-slate-800 flex items-center">
            <ShieldAlert className="text-red-500 mr-2" size={18} /> Accounts Requiring Attention
          </h3>
          <p className="text-xs text-slate-500 mt-1">Automatically flagged wallets with suspicious activity or negative balances.</p>
        </div>
        <div className="divide-y divide-slate-100">
           <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
             <div>
                <p className="font-bold text-slate-800">Lule Francis</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Field Agent</p>
             </div>
             <div className="flex flex-col items-end">
                <p className="font-bold text-red-600">UGX -450,000</p>
                <p className="text-xs text-red-500 font-medium">Negative Float Balance</p>
             </div>
           </div>
           <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
             <div>
                <p className="font-bold text-slate-800">Ssematimba R.</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Investor</p>
             </div>
             <div className="flex flex-col items-end">
                <p className="font-bold text-orange-600">UGX 0</p>
                <p className="text-xs text-orange-500 font-medium">3 Failed Withdrawals</p>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default COOWallets;
