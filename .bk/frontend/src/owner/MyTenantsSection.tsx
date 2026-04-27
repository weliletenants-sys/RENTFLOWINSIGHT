import { Users, MoreVertical, CreditCard, Download, Shield } from 'lucide-react';


interface MyTenantsSectionProps {
  onOpenAddTenant: () => void;
  onOpenRating: (tenantId: string) => void;
  onOpenEncourage: (tenantId: string) => void;
  tenants: any[];
}

export default function MyTenantsSection({ onOpenAddTenant, onOpenRating, onOpenEncourage, tenants = [] }: MyTenantsSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Users size={20} className="text-purple-600" />
            Your Tenants
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage rent operations and communications</p>
        </div>
        <button 
          onClick={onOpenAddTenant}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm transition"
        >
          Add Tenant
        </button>
      </div>

      <div className="space-y-4">
        {tenants.length === 0 ? (
          <div className="text-center p-6 text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-2xl">No tenants found. Invite one above.</div>
        ) : tenants.map((tenant) => (
          <div key={tenant.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-200 transition gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img src={tenant.avatar} alt={tenant.name} className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  {tenant.name}
                  {tenant.welileHomesEnrolled && (
                    <span title="Welile Homes Enrolled" className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full">
                      <Shield size={12} />
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Unit {tenant.unit}</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8 border-t border-slate-200 md:border-none pt-4 md:pt-0">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    tenant.status === 'paid' ? 'bg-emerald-500' : 
                    tenant.status === 'due' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
                    {tenant.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Rent Value</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition">
                  UGX {(tenant.rentAmount).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onOpenEncourage(tenant.id)}
                  className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
                  title="Send Message"
                >
                  <CreditCard size={18} />
                </button>
                <button 
                  onClick={() => onOpenRating(tenant.id)}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition"
                  title="Rate Tenant"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
