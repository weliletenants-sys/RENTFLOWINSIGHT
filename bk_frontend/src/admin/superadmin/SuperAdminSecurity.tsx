export default function SuperAdminSecurity() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Security Rules</h2>
        <p className="text-on-surface-variant font-body text-sm">Adjust system-wide rate limits, firewall IP blocks, and KYC global overrides.</p>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'wght' 500"}}>error</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">Global Intrusion Response</h3>
            <p className="text-sm text-on-surface-variant">Manage active geographical IP blocks and systemic rate-limiting firewalls.</p>
          </div>
        </div>

        <div className="h-px w-full bg-outline-variant/10 mb-6"></div>

        <button className="px-6 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-colors shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined">block</span>
          Configure Firewalls
        </button>
      </div>

    </div>
  );
}
