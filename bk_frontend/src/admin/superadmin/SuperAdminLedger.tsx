export default function SuperAdminLedger() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Ledger Config</h2>
        <p className="text-on-surface-variant font-body text-sm">Force syncs, view master financial queries, and run raw data migrations.</p>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'wght' 500"}}>dns</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">Master Ledger Synchronization</h3>
            <p className="text-sm text-on-surface-variant">Trigger manual reconciliations across all financial shards.</p>
          </div>
        </div>

        <div className="h-px w-full bg-outline-variant/10 mb-6"></div>

        <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined">sync</span>
          Force Global Sync
        </button>
      </div>

    </div>
  );
}
