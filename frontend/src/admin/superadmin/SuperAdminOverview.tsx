import { useNavigate } from 'react-router-dom';

export default function SuperAdminOverview() {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pointer-events-auto">
      
      {/* Dashboard Welcome Header */}
      <div className="mb-12 pointer-events-none">
        <p className="text-primary font-bold tracking-wider text-xs uppercase mb-2">Systems Overview</p>
        <h2 className="text-4xl sm:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Central Intelligence</h2>
        <div className="h-1 w-24 bg-primary-container rounded-full"></div>
      </div>

      {/* Root Governance Action Cards (Fully Responsive!) */}
      <div className="mb-8 pointer-events-none">
        <h2 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight mb-2">Root Terminal</h2>
        <p className="text-slate-500 font-body text-sm">Global system configuration and master data management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 pointer-events-auto relative z-10">
        
        {/* User Matrix */}
        <div 
          onClick={() => { console.log('CARD CLICKED: USER MATRIX'); navigate('/admin/users'); }}
          className="relative z-20 cursor-pointer pointer-events-auto bg-white rounded-xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:bg-slate-50 active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-5 md:group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'wght' 500"}}>group</span>
          </div>
          <h3 className="font-headline font-bold text-slate-800 text-lg mb-2">User Matrix</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-body">
            Manage global authorization, override roles, and audit access logs across all tiers.
          </p>
        </div>

        {/* Ledger Config */}
        <div 
          onClick={() => { console.log('CARD CLICKED: LEDGER CONFIG'); navigate('/admin/ledger'); }}
          className="relative z-20 cursor-pointer pointer-events-auto bg-white rounded-xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:bg-slate-50 active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-5 md:group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'wght' 500"}}>dns</span>
          </div>
          <h3 className="font-headline font-bold text-slate-800 text-lg mb-2">Ledger Config</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-body">
            Force syncs, view master financial queries, and run raw data migrations.
          </p>
        </div>

        {/* Security Rules */}
        <div 
          onClick={() => { console.log('CARD CLICKED: SECURITY RULES'); navigate('/admin/security'); }}
          className="relative z-20 cursor-pointer pointer-events-auto bg-white rounded-xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:bg-slate-50 active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 mb-5 md:group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'wght' 500"}}>error</span>
          </div>
          <h3 className="font-headline font-bold text-slate-800 text-lg mb-2">Security Rules</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-body">
            Adjust system-wide rate limits, firewall IP blocks, and KYC global overrides.
          </p>
        </div>

      </div>

      {/* Bento-Style Hub Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 pointer-events-auto relative z-10">
        
        {/* CEO Dashboard (Large Feature) */}
        <div 
          onClick={() => { console.log('CARD CLICKED: CEO PORTAL'); navigate('/executive/ceo?mode=view'); }}
          className="relative z-20 cursor-pointer md:col-span-4 pointer-events-auto group overflow-hidden bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[320px]"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors pointer-events-none"></div>
          <div className="pointer-events-none">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="insights" style={{fontVariationSettings: "'FILL' 1"}}>insights</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">CEO Dashboard</h3>
            <p className="text-on-surface-variant max-w-md leading-relaxed">High-level strategic overview including market position, global revenue streams, and enterprise-wide critical KPIs.</p>
          </div>
          <div className="flex items-center justify-between mt-8 relative z-10 pointer-events-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Confidential Access</span>
            <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors pointer-events-none">
              Launch Portal
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* COO Dashboard (Vertical) */}
        <div 
          onClick={() => { console.log('CARD CLICKED: COO PORTAL'); navigate('/executive/coo?mode=view'); }}
          className="relative z-20 cursor-pointer pointer-events-auto md:col-span-2 group bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <div className="pointer-events-none w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl" data-icon="account_tree">account_tree</span>
          </div>
          <h3 className="pointer-events-none text-xl font-headline font-bold text-on-surface mb-3">COO Dashboard</h3>
          <p className="pointer-events-none text-sm text-on-surface-variant leading-relaxed mb-8 flex-1">Monitor operational efficiency, supply chain integrity, and internal process health across all regions.</p>
          <button className="pointer-events-none w-full py-3 rounded-xl border border-outline-variant/30 text-secondary font-semibold transition-colors">
            Enter Workspace
          </button>
        </div>

        {/* CFO Dashboard */}
        <div 
          onClick={() => { console.log('CARD CLICKED: CFO PORTAL'); navigate('/executive/cfo?mode=view'); }}
          className="relative z-20 cursor-pointer pointer-events-auto md:col-span-2 group bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="pointer-events-none w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl" data-icon="account_balance">account_balance</span>
          </div>
          <h3 className="pointer-events-none text-xl font-headline font-bold text-on-surface mb-3">CFO Dashboard</h3>
          <p className="pointer-events-none text-sm text-on-surface-variant leading-relaxed">Real-time fiscal monitoring, burn rates, and quarterly projections with automated auditing.</p>
        </div>

        {/* CTO Dashboard */}
        <div 
          onClick={() => { console.log('CARD CLICKED: CTO PORTAL'); navigate('/executive/cto?mode=view'); }}
          className="relative z-20 cursor-pointer pointer-events-auto md:col-span-2 group bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="pointer-events-none w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl" data-icon="terminal">terminal</span>
          </div>
          <h3 className="pointer-events-none text-xl font-headline font-bold text-on-surface mb-3">CTO Dashboard</h3>
          <p className="pointer-events-none text-sm text-on-surface-variant leading-relaxed">Infrastructure uptime, technical debt indicators, and ongoing engineering velocity tracking.</p>
        </div>

        {/* Manager Hub */}
        <div 
          onClick={() => { console.log('CARD CLICKED: MANAGER HUB'); navigate('/dashboard?mode=view'); }}
          className="relative z-20 cursor-pointer pointer-events-auto md:col-span-2 group bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="pointer-events-none w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl" data-icon="badge">badge</span>
          </div>
          <h3 className="pointer-events-none text-xl font-headline font-bold text-on-surface mb-3">Manager Hub</h3>
          <p className="pointer-events-none text-sm text-on-surface-variant leading-relaxed">Personnel performance metrics, department-level OKRs, and localized team management tools.</p>
        </div>

      </div>

      {/* Footer Stats Overlay - Not interactable generally except link */}
      <div className="mt-12 flex flex-wrap gap-8 items-center justify-between p-8 bg-surface-container-low rounded-xl border border-outline-variant/10 relative z-10 pointer-events-none">
        <div className="flex flex-wrap items-center gap-6 sm:gap-12">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">System Load</p>
            <p className="text-lg font-headline font-bold text-primary-container drop-shadow-sm">Minimal (2%)</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Sessions</p>
            <p className="text-lg font-headline font-bold text-on-surface">1,204</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Last Update</p>
            <p className="text-lg font-headline font-bold text-on-surface">Just now</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-primary font-semibold text-sm cursor-pointer hover:underline pointer-events-auto">
          View Network Health
          <span className="material-symbols-outlined text-sm" data-icon="open_in_new">open_in_new</span>
        </div>
      </div>
    </div>
  );
}
