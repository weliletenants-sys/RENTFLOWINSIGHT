import { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, Clock, Tag } from 'lucide-react';
interface FunderInvestCTAProps {
  onStartsupporting?: () => void;
}

export default function FunderInvestCTA({ onStartsupporting }: FunderInvestCTAProps) {
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    import('../services/funderApi').then(({ getFunderOpportunities }) => {
      getFunderOpportunities().then(ops => {
        setOpportunities(ops.slice(0, 2).map((op: any) => ({
          id: op.id,
          name: op.name,
          roi: op.rentRequired > 2000000 ? 12 : 20, // Simplified display mapping
          durationMonths: 12,
          minInvestment: op.rentRequired,
          riskLevel: op.status === 'urgent' ? 'High' : 'Low',
          isFeatured: op.status === 'available',
          slotsLeft: op.status === 'urgent' ? 2 : null,
        })));
      }).catch(() => setOpportunities([]));
    });
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-gray-900 text-lg">Recommended Opportunities</h3>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className={`relative bg-white rounded-2xl p-5 border flex flex-col transition-all cursor-pointer hover:shadow-lg ${
              opp.isFeatured ? 'border-[var(--color-primary)] shadow-md' : 'border-[var(--color-primary-border)] hover:border-[var(--color-primary-light)]'
            }`}
          >
            {/* Featured Badge */}
            {opp.isFeatured && (
              <div className="absolute -top-3 left-4 bg-[var(--color-primary)] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Tag className="w-3 h-3" /> Featured
              </div>
            )}

            {/* Header info */}
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">{opp.name}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-semibold flex items-center gap-1 ${
                    opp.riskLevel === 'Low' ? 'text-green-600' : opp.riskLevel === 'Medium' ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    <ShieldAlert className="w-3.5 h-3.5" /> {opp.riskLevel} Risk
                  </span>
                  {opp.slotsLeft && (
                    <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {opp.slotsLeft} slots left!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Expected ROI</p>
                <p className="font-bold text-[var(--color-success)] text-lg flex items-center gap-1">
                  {opp.roi}% <TrendingUp className="w-4 h-4" />
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                <p className="font-bold text-gray-900 text-base">{opp.durationMonths} Mos</p>
              </div>
              <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Min Investment</p>
                <p className="font-bold text-gray-900 text-sm">UGX {(opp.minInvestment / 1000).toLocaleString()}K</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onStartsupporting}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all focus:scale-[0.98] ${
                opp.isFeatured
                  ? 'bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-dark)]'
                  : 'bg-[var(--color-primary-faint)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
              }`}
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
