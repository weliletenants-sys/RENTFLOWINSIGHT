import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Home,
  Filter,
  ChevronRight,
  Eye,
  Banknote,
  Loader2
} from 'lucide-react';
import { getFunderOpportunities } from '../services/funderApi';
import VirtualHouseCard from './components/VirtualHouseCard';

/* ═══════════ TYPES ═══════════ */

type OpportunityStatus = 'available' | 'urgent' | 'taken';

interface RentOpportunity {
  id: string;
  name: string;
  location: string;
  image: string;
  rentRequired: number;
  bedrooms: number;
  status: OpportunityStatus;
  postedDate: string;
}

/* ═══════════ STATUS CONFIG ═══════════ */

const statusConfig: Record<OpportunityStatus, { label: string; bg: string; text: string }> = {
  available: { label: 'Available', bg: 'bg-green-50', text: 'text-green-700' },
  urgent: { label: 'Urgent', bg: 'bg-red-50', text: 'text-red-600' },
  taken: { label: 'Taken', bg: 'bg-slate-100', text: 'text-slate-400' },
};

/* ═══════════ FILTER TYPE ═══════════ */
type FilterStatus = 'all' | OpportunityStatus;

/* ═══════════ PROPS ═══════════ */
interface FunderOpportunitiesPageProps {
  onSupport?: (propertyId: string) => void;
}

/* ═══════════════════════════════════════════════════════ */
/*         OPPORTUNITIES PAGE — Rent Support              */
/* ═══════════════════════════════════════════════════════ */
export default function FunderOpportunitiesPage({ onSupport }: FunderOpportunitiesPageProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<RentOpportunity | null>(null);
  const [opportunities, setOpportunities] = useState<RentOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFunderOpportunities()
      .then(setOpportunities)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = opportunities.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /* Summary stats */
  const totalAvailable = opportunities.filter(p => p.status !== 'taken').length;
  const totalRentNeeded = opportunities.filter(p => p.status !== 'taken').reduce((s, p) => s + p.rentRequired, 0);

  /* ══════════════  PROPERTY DETAIL VIEW  ══════════════ */
  if (selectedProperty) {
    return (
      <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
        <button
          onClick={() => setSelectedProperty(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-5 hover:text-gray-600 transition"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to Opportunities
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.name}
              className="w-full h-64 lg:h-80 object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{selectedProperty.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedProperty.location}
                </div>
              </div>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${statusConfig[selectedProperty.status].bg} ${statusConfig[selectedProperty.status].text}`}>
                {statusConfig[selectedProperty.status].label}
              </span>
            </div>

            {/* Rent Amount — big and clear */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 mb-4 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rent Required</p>
              <p className="text-2xl font-black text-slate-900">UGX {selectedProperty.rentRequired.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1">One-time payment</p>
            </div>

            {/* Info Rows */}
            <div className="space-y-2 mb-5">
              {[
                { label: 'Property', value: selectedProperty.name },
                { label: 'Location', value: selectedProperty.location },
                { label: 'Bedrooms', value: `${selectedProperty.bedrooms}` },
                { label: 'Payment Type', value: 'One-time rent support' },
                { label: 'Posted', value: selectedProperty.postedDate },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-[11px] text-slate-400">{row.label}</span>
                  <span className="text-[13px] font-bold text-slate-900">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Support Button */}
            <button
              onClick={() => onSupport?.(selectedProperty.id)}
              disabled={selectedProperty.status === 'taken'}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:shadow-lg active:scale-[0.98] ${selectedProperty.status === 'taken' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-white'
                }`}
              style={selectedProperty.status !== 'taken' ? { background: 'var(--color-primary)' } : undefined}
            >
              <Banknote className="w-4 h-4" />
              {selectedProperty.status === 'taken' ? 'Already Supported' : 'Support this Tenant'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════  MAIN OPPORTUNITIES LIST  ══════════════ */
  return (
    <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Opportunities
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {totalAvailable} houses need rent support · UGX {totalRentNeeded.toLocaleString()} total
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search houses..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:border-[var(--color-primary)] transition"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {(['all', 'available', 'urgent', 'taken'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === f
                  ? 'text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              style={filter === f ? { background: 'var(--color-primary)' } : undefined}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
          <Home className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-500 mb-1">No houses found</h3>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} onClick={() => setSelectedProperty(p)} className="h-full">
              <VirtualHouseCard
                id={p.id}
                name={p.name}
                location={p.location}
                image={p.image}
                rentRequired={p.rentRequired}
                bedrooms={p.bedrooms}
                status={p.status}
                postedDate={p.postedDate}
                onFundClick={(id) => onSupport?.(id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
