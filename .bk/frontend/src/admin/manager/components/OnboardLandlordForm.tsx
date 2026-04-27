import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../../services/managerApi';
import { Network, DatabaseZap, FileCheck2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OnboardLandlordForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    properties_count: 1
  });

  const provisionRegistry = useMutation({
    mutationFn: () => managerApi.onboardLandlord(formData),
    onSuccess: () => {
      toast.success('Landlord identity matrix correctly encoded into the database!');
      setFormData({ full_name: '', phone: '', email: '', properties_count: 1 });
      queryClient.invalidateQueries({ queryKey: ['manager_landlord_disbursements'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || 'System allocation fault during provisioning.';
      toast.error(msg);
    }
  });

  return (
    <div className="max-w-xl font-inter">
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4 items-start">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <DatabaseZap size={24} />
             </div>
             <div>
               <h3 className="font-bold text-slate-900 tracking-tight text-lg">Provision New Beneficiary</h3>
               <p className="text-sm text-slate-500 mt-1 leading-relaxed">Opening a landlord profile automatically generates their business wallet, routing logic, and ties them to operations for external payments.</p>
             </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); provisionRegistry.mutate(); }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Official Legal Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Acme Properties Corp." 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Phone Network</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Asset Registry Counts</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.properties_count}
                    onChange={e => setFormData({ ...formData, properties_count: Number(e.target.value) })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Secure Escrow Email (Optional)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@acme.inc" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={provisionRegistry.isPending || !formData.full_name || !formData.phone}
              className="mt-6 w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest shadow-lg shadow-black/20 text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {provisionRegistry.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Network size={18} />
                  Authorize & Provision User
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
