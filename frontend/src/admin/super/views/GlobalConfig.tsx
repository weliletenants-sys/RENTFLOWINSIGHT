import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function GlobalConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/superadmin/config', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConfig(res.data);
      } catch (err) {
        console.error('Failed to load config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/superadmin/config', config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Global configuration synchronized successfully.');
    } catch (err) {
      console.error('Failed to save config:', err);
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[500px]">
          <p className="font-label text-sm uppercase text-slate-500 tracking-widest animate-pulse">Syncing Telemetry...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-24">
        {/* Config Grid */}
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Global Configuration</h2>
            <p className="font-label text-xs text-slate-500 opacity-60">System-wide parameters for transaction routing and security protocols.</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            
            {/* Section 1: Fees Configuration & Limits */}
            <section className="col-span-12 xl:col-span-8 space-y-4">
              
              {/* Fees Configuration */}
              <div className="bg-white p-6 rounded-xl space-y-6 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#9234eb]" data-icon="payments">payments</span>
                  <h3 className="font-bold text-slate-900">Fees Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Transaction Fee (%)</label>
                    <div className="relative">
                      <input 
                        value={config.transactionFee} 
                        onChange={(e) => handleChange('transactionFee', e.target.value)}
                        className="w-full px-4 py-3 rounded text-slate-900 font-label text-sm bg-slate-50 border border-slate-200 focus:border-[#9234eb] focus:ring-inset focus:ring-1 focus:ring-[#dcb8ff]/20 outline-none transition-all" 
                        type="text" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Property Listing Fee (USD)</label>
                    <div className="relative">
                      <input 
                        value={config.listingFee}
                        onChange={(e) => handleChange('listingFee', e.target.value)}
                        className="w-full px-4 py-3 rounded text-slate-900 font-label text-sm bg-slate-50 border border-slate-200 focus:border-[#9234eb] focus:ring-inset focus:ring-1 focus:ring-[#dcb8ff]/20 outline-none transition-all" 
                        type="text" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">USD</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">Service Tax Surcharge</label>
                    <div className="relative">
                      <input 
                        value={config.serviceTax}
                        onChange={(e) => handleChange('serviceTax', e.target.value)}
                        className="w-full px-4 py-3 rounded text-slate-900 font-label text-sm bg-slate-50 border border-slate-200 focus:border-[#9234eb] focus:ring-inset focus:ring-1 focus:ring-[#dcb8ff]/20 outline-none transition-all" 
                        type="text" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">FIXED</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase text-slate-500 tracking-wider">International Processing</label>
                    <div className="relative">
                      <input 
                        value={config.intlProcessing}
                        onChange={(e) => handleChange('intlProcessing', e.target.value)}
                        className="w-full px-4 py-3 rounded text-slate-900 font-label text-sm bg-slate-50 border border-slate-200 focus:border-[#9234eb] focus:ring-inset focus:ring-1 focus:ring-[#dcb8ff]/20 outline-none transition-all" 
                        type="text" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Limits */}
              <div className="bg-white p-6 rounded-xl space-y-6 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#9234eb]" data-icon="speed">speed</span>
                  <h3 className="font-bold text-slate-900">System Limits</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                    <label className="font-label text-[10px] uppercase text-slate-500 block mb-2">Max Wallet Balance</label>
                    <input value={config.maxWallet} onChange={(e) => handleChange('maxWallet', e.target.value)} className="bg-transparent border-none p-0 text-slate-900 font-label text-lg w-full focus:ring-0 outline-none" type="text" />
                    <span className="text-[9px] text-slate-400 block mt-1">USD PER USER</span>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                    <label className="font-label text-[10px] uppercase text-slate-500 block mb-2">Active Sessions</label>
                    <input value={config.activeSessions} onChange={(e) => handleChange('activeSessions', e.target.value)} className="bg-transparent border-none p-0 text-slate-900 font-label text-lg w-full focus:ring-0 outline-none" type="text" />
                    <span className="text-[9px] text-slate-400 block mt-1">CONCURRENT</span>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded">
                    <label className="font-label text-[10px] uppercase text-slate-500 block mb-2">Daily Withdrawal</label>
                    <input value={config.dailyWithdrawal} onChange={(e) => handleChange('dailyWithdrawal', e.target.value)} className="bg-transparent border-none p-0 text-slate-900 font-label text-lg w-full focus:ring-0 outline-none" type="text" />
                    <span className="text-[9px] text-slate-400 block mt-1">USD LIMIT</span>
                  </div>
                </div>
              </div>

            </section>

            {/* Section 3: Feature Toggles (Asymmetric sidebar) */}
            <section className="col-span-12 xl:col-span-4 space-y-4">
              <div className="bg-slate-50 p-6 rounded-xl space-y-6 h-full border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#9234eb]" data-icon="toggle_on">toggle_on</span>
                  <h3 className="font-bold text-slate-900">Feature Toggles</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Toggle Item */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">Live Staging</span>
                      <span className="text-[10px] text-slate-500 font-label">Parallel environment sync</span>
                    </div>
                    <button 
                      onClick={() => handleChange('stagingToggle', !config.stagingToggle)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config.stagingToggle ? 'bg-[#00a572] shadow-[0_0_8px_rgba(78,222,163,0.3)]' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.stagingToggle ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  {/* Toggle Item */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">New KYC Flow</span>
                      <span className="text-[10px] text-slate-500 font-label">Biometric verification V3</span>
                    </div>
                    <button 
                      onClick={() => handleChange('kycToggle', !config.kycToggle)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config.kycToggle ? 'bg-[#00a572] shadow-[0_0_8px_rgba(78,222,163,0.3)]' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.kycToggle ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  {/* Toggle Item */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">API Access V2</span>
                      <span className="text-[10px] text-slate-500 font-label">Public GraphQL endpoint</span>
                    </div>
                    <button 
                      onClick={() => handleChange('apiToggle', !config.apiToggle)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config.apiToggle ? 'bg-[#00a572] shadow-[0_0_8px_rgba(78,222,163,0.3)]' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.apiToggle ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  {/* Toggle Item */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-40">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">Legacy Auth</span>
                      <span className="text-[10px] text-slate-500 font-label">Scheduled for deprecation</span>
                    </div>
                    <button 
                      onClick={() => handleChange('legacyToggle', !config.legacyToggle)}
                      className={`w-10 h-5 rounded-full relative transition-colors cursor-not-allowed ${config.legacyToggle ? 'bg-[#00a572] shadow-[0_0_8px_rgba(78,222,163,0.3)]' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.legacyToggle ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-200 mt-6">
                  <div className="bg-slate-50 p-4 rounded border border-[#9234eb]/20">
                    <p className="text-[10px] font-label text-[#9234eb] uppercase leading-tight font-bold">System Status</p>
                    <p className="text-xs text-slate-900 mt-2">All feature flags are currently locked under 2FA requirements for Super Admins.</p>
                  </div>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </div>

      {/* Sticky Footer Action Bar */}
      <footer className="fixed bottom-0 right-0 left-0 lg:left-64 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-between px-8 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-slate-400" data-icon="info">info</span>
          <div className="flex flex-col">
            <span className="font-label text-[10px] uppercase text-slate-500 tracking-widest">Audit Trail</span>
            <span className="text-xs text-slate-900 opacity-60 italic">Last saved by admin_id: 821 on 2026-03-12</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${saving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#9234eb] text-white hover:brightness-110 shadow-[0_5px_15px_rgba(146,52,235,0.3)]'}`}
          >
            {saving ? 'Synchronizing...' : 'Save Configuration'}
          </button>
        </div>
      </footer>

    </AdminLayout>
  );
}
