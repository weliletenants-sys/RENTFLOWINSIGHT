import React, { useState } from 'react';
import { Shield, Users, CheckSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EnrollTenantWelileHomesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: any[];
}

export default function EnrollTenantWelileHomesDialog({ isOpen, onClose, tenants = [] }: EnrollTenantWelileHomesDialogProps) {
  const [loading, setLoading] = useState(false);
  const eligibleTenants = tenants.filter(t => !t.welileHomesEnrolled);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Tenant successfully enrolled in the guaranteed rent program.');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-emerald-100 dark:border-slate-800 bg-emerald-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-full shadow-md shadow-emerald-600/30">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Enroll Tenant</h2>
          </div>
          <button onClick={onClose} className="text-emerald-700 hover:bg-emerald-200 dark:hover:bg-slate-800 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-slate-500 mb-2">
            Secure your rent guarantee and help your tenant start saving towards a home. Select an eligible tenant below.
          </p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Tenant</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
              >
                <option value="">Choose a tenant...</option>
                {eligibleTenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name} (Unit {tenant.unit})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-2 text-sm">
              <CheckSquare size={16} /> Terms Verified
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-500 space-y-1.5 list-disc pl-4">
              <li>10% of collected rent will be redirected to the tenant's Welile Homes savings balance.</li>
              <li>Welile AI insures the principal rent; if they default, you are completely covered.</li>
              <li>You agree to the 1-year Welile Homes term limit.</li>
            </ul>
          </div>

          <button 
            type="submit" 
            disabled={loading || eligibleTenants.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Confirm Enrollment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
