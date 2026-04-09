import React from 'react';
import { useNavigate } from 'react-router-dom';

const DASHBOARD_ROUTES = {
  executive: [
    { id: 'ceo', title: 'CEO Dashboard', desc: 'Platform overview & strategy', path: '/admin/executive/ceo/dashboard', color: 'bg-amber-50', textColor: 'text-amber-700', border: 'border-amber-200', icon: '👑' },
    { id: 'cto', title: 'CTO Dashboard', desc: 'Infrastructure & engineering', path: '/admin/executive/cto/dashboard', color: 'bg-blue-50', textColor: 'text-blue-600', border: 'border-blue-200', icon: '💻' },
    { id: 'cfo', title: 'CFO Dashboard', desc: 'Financial governance', path: '/admin/executive/cfo/dashboard', color: 'bg-emerald-50', textColor: 'text-emerald-700', border: 'border-emerald-200', icon: '📊' },
    { id: 'coo', title: 'COO Dashboard', desc: 'Operations health', path: '/admin/executive/coo/dashboard', color: 'bg-purple-50', textColor: 'text-purple-700', border: 'border-purple-200', icon: '📈' },
    { id: 'cmo', title: 'CMO Dashboard', desc: 'Marketing & growth', path: '/admin/executive/cmo/dashboard', color: 'bg-rose-50', textColor: 'text-rose-600', border: 'border-rose-200', icon: '📣' },
    { id: 'crm', title: 'CRM Dashboard', desc: 'Customer support & disputes', path: '/admin/executive/crm/dashboard', color: 'bg-orange-50', textColor: 'text-orange-600', border: 'border-orange-200', icon: '💬' }
  ],
  operations: [
    { id: 'finops', title: 'Financial Ops', desc: 'Deposits, withdrawals, ledger & reconcili...', path: '/admin/ops/finops', color: 'bg-teal-50', textColor: 'text-teal-700', border: 'border-teal-200', icon: '🧮' },
    { id: 'staff', title: 'Company Staff', desc: 'Manage employees & staff accounts', path: '/admin/hr/dashboard', color: 'bg-red-50', textColor: 'text-red-600', border: 'border-red-200', icon: '🛡️' },
    { id: 'agentops', title: 'Agent Ops', desc: 'Agent performance & activity', path: '/admin/ops/agent', color: 'bg-indigo-50', textColor: 'text-indigo-600', border: 'border-indigo-200', icon: '👥' },
    { id: 'tenantops', title: 'Tenant Ops', desc: 'Tenant metrics & rentals', path: '/admin/ops/tenant', color: 'bg-cyan-50', textColor: 'text-cyan-700', border: 'border-cyan-200', icon: '🏠' },
    { id: 'landlordops', title: 'Landlord Ops', desc: 'Property management', path: '/admin/ops/landlord', color: 'bg-sky-50', textColor: 'text-sky-600', border: 'border-sky-200', icon: '🏢' },
    { id: 'partnerops', title: 'Partner Ops', desc: 'Supporter portfolios', path: '/admin/ops/partner', color: 'bg-violet-50', textColor: 'text-violet-700', border: 'border-violet-200', icon: '🤝' }
  ]
};

export default function DashboardAccessPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Dashboard
          </button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Access Panel</h1>
            <p className="text-muted-foreground mt-1">Open any executive or operations dashboard you have access to</p>
          </div>
        </div>

        {/* Executive Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Executive Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DASHBOARD_ROUTES.executive.map((dash) => (
              <button
                key={dash.id}
                onClick={() => navigate(dash.path)}
                className={`p-6 text-left flex items-start gap-4 border rounded-xl hover:shadow-md transition-all active:scale-[0.98] ${dash.color} ${dash.border}`}
              >
                <div className={`p-2 rounded-lg bg-background shadow-sm ${dash.textColor} text-xl`}>
                  {dash.icon}
                </div>
                <div>
                  <h3 className={`font-bold ${dash.textColor}`}>{dash.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{dash.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Operations Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operations Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DASHBOARD_ROUTES.operations.map((dash) => (
              <button
                key={dash.id}
                onClick={() => navigate(dash.path)}
                className={`p-6 text-left flex items-start gap-4 border rounded-xl hover:shadow-md transition-all active:scale-[0.98] ${dash.color} ${dash.border}`}
              >
                <div className={`p-2 rounded-lg bg-background shadow-sm ${dash.textColor} text-xl`}>
                  {dash.icon}
                </div>
                <div>
                  <h3 className={`font-bold ${dash.textColor}`}>{dash.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{dash.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
