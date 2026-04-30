import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SuperAdminSystemConfig() {
  const [flags, setFlags] = useState({ transfers: true, withdrawals: true, registrations: false });
  const [maintenance, setMaintenance] = useState(false);

  const toggleFlag = (key: keyof typeof flags) => setFlags(prev => ({ ...prev, [key]: !prev[key] }));

  const handleEmergencyAction = (action: string) => {
    toast.error(`${action} INITIATED - TWO-FACTOR REQUIRED`, { icon: '🚨', duration: 4000 });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      
      {/* Maintenance Mode Banner (Conditional Reveal) */}
      {maintenance && (
        <div className="relative overflow-hidden bg-tertiary-container/10 border-l-4 border-tertiary-container p-6 rounded-xl flex items-center gap-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-tertiary-container" data-icon="warning" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
          </div>
          <div className="flex-1">
            <h3 className="text-on-tertiary-container font-headline font-bold text-lg">Maintenance Mode Strategy</h3>
            <p className="text-on-tertiary-container/80 text-sm font-medium">When active, all public facing API endpoints return a 503 status code. Only administrators with Root Access can bypass the throttle.</p>
          </div>
          <div className="flex items-center gap-4 px-6 border-l border-tertiary-container/20">
            <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container/60">Status: Active</span>
          </div>
        </div>
      )}

      {/* Bento Grid Section */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Feature Flags Card */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Feature Flags</h2>
              <p className="text-on-surface-variant text-sm mt-1">Global toggle for core system modules</p>
            </div>
            <span className="material-symbols-outlined text-primary" data-icon="toggle_on" style={{fontVariationSettings: "'FILL' 1"}}>toggle_on</span>
          </div>
          <div className="space-y-6">
            
            {/* Toggle Row 1 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined" data-icon="swap_horiz">swap_horiz</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Enable Transfers</p>
                  <p className="text-xs text-on-surface-variant">Allow P2P and external wallet transfers</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={flags.transfers} onChange={() => toggleFlag('transfers')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>

            {/* Toggle Row 2 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Enable Withdrawals</p>
                  <p className="text-xs text-on-surface-variant">Permit fiat currency off-ramping</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={flags.withdrawals} onChange={() => toggleFlag('withdrawals')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>

            {/* Toggle Row 3 */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Enable Registrations</p>
                  <p className="text-xs text-on-surface-variant">Allow new users to create accounts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={flags.registrations} onChange={() => toggleFlag('registrations')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Controls Card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Financial Controls</h2>
            <p className="text-on-surface-variant text-sm mt-1">Thresholds and liquidity management</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Max withdrawal limit (Daily)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium">$</span>
                </div>
                <input type="text" defaultValue="50,000.00" className="block w-full pl-8 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface font-semibold focus:ring-2 focus:ring-primary-container transition-all" />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <span className="text-xs font-bold text-slate-400">USD</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Investment threshold</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium">$</span>
                </div>
                <input type="text" defaultValue="5,000.00" className="block w-full pl-8 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface font-semibold focus:ring-2 focus:ring-primary-container transition-all" />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <span className="text-xs font-bold text-slate-400">USD</span>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-[0_8px_16px_rgba(120,0,208,0.2)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-[0.98]">
                <span className="material-symbols-outlined text-lg" data-icon="save">save</span>
                Apply Thresholds
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Mode Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="font-headline font-bold text-xl text-on-surface">Maintenance Mode</h2>
              <p className="text-on-surface-variant text-xs mt-1">Shut down client-side access globally</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <label className="relative inline-flex items-center cursor-pointer scale-150">
                <input type="checkbox" className="sr-only peer" checked={maintenance} onChange={() => setMaintenance(!maintenance)} />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-tertiary-container"></div>
              </label>
              <span className="mt-8 text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                {maintenance ? 'System is locked' : 'System is currently live'}
              </span>
            </div>
            <p className="text-[10px] text-center text-slate-400 leading-relaxed italic">Warning: Activation results in immediate disconnection of all active socket sessions.</p>
          </div>
        </div>

        {/* Emergency Controls Card */}
        <div className="col-span-12 lg:col-span-8 bg-error-container/20 p-8 rounded-xl border border-error/20">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="font-headline font-bold text-2xl text-error tracking-tight">Emergency Controls</h2>
              <p className="text-on-error-container text-sm mt-1">High-privileged destructive actions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined" data-icon="lock_reset" style={{fontVariationSettings: "'wght' 600"}}>lock_reset</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleEmergencyAction('GLOBAL FREEZE')}
              className="flex items-center justify-between p-6 bg-error text-white rounded-xl shadow-[0_8px_20px_rgba(186,26,26,0.25)] hover:bg-error/90 transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <span className="block font-bold text-lg leading-tight">Freeze All Transactions</span>
                <span className="text-[11px] font-medium opacity-80 uppercase tracking-widest">Immediate Hard Lock</span>
              </div>
              <span className="material-symbols-outlined text-3xl" data-icon="ac_unit">ac_unit</span>
            </button>
            <button 
              onClick={() => handleEmergencyAction('DISABLE WITHDRAWALS')}
              className="flex items-center justify-between p-6 bg-white border-2 border-error text-error rounded-xl hover:bg-error/5 transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <span className="block font-bold text-lg leading-tight">Disable Withdrawals</span>
                <span className="text-[11px] font-medium opacity-60 uppercase tracking-widest">Selective Stoppage</span>
              </div>
              <span className="material-symbols-outlined text-3xl" data-icon="block">block</span>
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-white/50 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-sm" data-icon="info">info</span>
            <p className="text-[11px] text-on-error-container font-semibold">Verification required: Emergency actions require 2FA confirmation from two separate root administrators.</p>
          </div>
        </div>
      </div>

      {/* Audit Trail Snippet */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface">Recent Configuration Changes</h3>
          <button className="text-primary font-bold text-xs hover:underline cursor-pointer">View Full Audit Log</button>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Administrator</th>
                <th className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Action</th>
                <th className="px-6 py-4 text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Value</th>
                <th className="px-6 py-4 text-right font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-on-surface">Sarah Jenkins</td>
                <td className="px-6 py-4 text-on-surface-variant">Update Withdrawal Limit</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-surface-container rounded-md text-[10px] font-bold text-on-surface-variant">$50k → $75k</span></td>
                <td className="px-6 py-4 text-right text-slate-400 text-xs">2 mins ago</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-on-surface">Michael Chen</td>
                <td className="px-6 py-4 text-on-surface-variant">Disable Registration</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-error-container text-on-error-container rounded-md text-[10px] font-bold">OFF</span></td>
                <td className="px-6 py-4 text-right text-slate-400 text-xs">14 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
