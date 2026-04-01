import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, Search, ArrowRight, DollarSign } from 'lucide-react';

export default function DailyPaymentTracker() {
  const [targetDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [trackerState] = useState({
    expectedToday: 45,
    receivedToday: 12,
    missedToday: 3,
    totalExpectedUGX: 1250000,
    totalReceivedUGX: 350000
  });

  const [tenants] = useState([
    { id: 'TNT-102', name: 'Alice M.', expected: 25000, received: 25000, status: 'success', time: '08:14 AM' },
    { id: 'TNT-405', name: 'Brian O.', expected: 15000, received: 0, status: 'pending', time: '--' },
    { id: 'TNT-892', name: 'Christine A.', expected: 50000, received: 0, status: 'missed', time: '--' },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Daily Payment Tracker</h3>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{targetDate} • Live Check</p>
        </div>
        
        <div className="flex gap-4">
           {/* Summary badges */}
           <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected</span>
              <span className="font-bold text-slate-900">UGX {trackerState.totalExpectedUGX.toLocaleString()}</span>
           </div>
           <div className="w-px bg-slate-200"></div>
           <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Received</span>
              <span className="font-bold text-emerald-600">UGX {trackerState.totalReceivedUGX.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 bg-white">
          <div className="p-6 flex items-center justify-between">
              <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Expected Remittances</p>
                  <p className="text-3xl font-black text-slate-800">{trackerState.expectedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <Clock size={20} />
              </div>
          </div>
          <div className="p-6 flex items-center justify-between">
              <div>
                  <p className="text-sm font-bold text-emerald-600 mb-1">Successfully Cleared</p>
                  <p className="text-3xl font-black text-emerald-700">{trackerState.receivedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                  <CheckCircle size={20} />
              </div>
          </div>
          <div className="p-6 flex items-center justify-between">
              <div>
                  <p className="text-sm font-bold text-red-600 mb-1">Missed Deadlines</p>
                  <p className="text-3xl font-black text-red-700">{trackerState.missedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                  <AlertTriangle size={20} />
              </div>
          </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
           <h4 className="font-bold text-slate-800">Tenant Deduction Queue</h4>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Filter by ID..." className="pl-8 pr-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md outline-none focus:border-[var(--color-primary)] bg-slate-50"/>
           </div>
        </div>
        
        <div className="space-y-3">
          {tenants.map(t => (
            <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-colors shadow-sm gap-4">
              <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${
                      t.status === 'success' ? 'bg-emerald-500' :
                      t.status === 'pending' ? 'bg-slate-300' : 'bg-red-500'
                  }`}></div>
                  <div>
                      <h5 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">{t.name} <span className="text-xs text-slate-400 ml-2 font-medium">{t.id}</span></h5>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{t.status === 'success' ? `Cleared at ${t.time}` : 'Awaiting sync'}</p>
                  </div>
              </div>
              
              <div className="flex items-center gap-6">
                  <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase">Target</p>
                      <p className="font-bold text-slate-700">UGX {t.expected.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase">Deducted</p>
                      <p className={`font-bold ${t.received > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          UGX {t.received.toLocaleString()}
                      </p>
                  </div>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                      <ArrowRight size={16} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
