import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Home,
  Filter,
  ChevronRight,
  Eye,
  Banknote,
  Loader2,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
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
  walletBalance?: number;
}

/* ═══════════════════════════════════════════════════════ */
/*         OPPORTUNITIES PAGE — Rent Support              */
/* ═══════════════════════════════════════════════════════ */
export default function FunderOpportunitiesPage({ onSupport, walletBalance = 0 }: FunderOpportunitiesPageProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<RentOpportunity | null>(null);
  const [opportunities, setOpportunities] = useState<RentOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Angel Pool State
  const PRICE_PER_SHARE = 20000;
  const ANGEL_POOL_CAP = 500000000;
  // Mock raised amount for aesthetics based on V3 specs
  const raisedAmount = 312400000; 
  
  const [sharesInput, setSharesInput] = useState<string>('');
  const [isDeployingAngel, setIsDeployingAngel] = useState(false);

  const investmentAmount = (parseInt(sharesInput) || 0) * PRICE_PER_SHARE;
  const isSufficientBalance = investmentAmount <= walletBalance;
  const isInputValid = investmentAmount > 0 && investmentAmount % PRICE_PER_SHARE === 0;

  const handleAngelPoolInvestment = async () => {
    if (isDeployingAngel) return;
    if (!isInputValid || !isSufficientBalance) return;
    setIsDeployingAngel(true);
    const toastId = toast.loading('Connecting securely to Welile Angel Pool...');
    
    try {
      const response = await fetch('/api/funder/financial/angel-pool', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: investmentAmount })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Investment failed');

      toast.success(data.message || `Successfully purchased ${parseInt(sharesInput)} shares!`, { id: toastId });
      setSharesInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to process Angel Pool investment', { id: toastId });
    } finally {
      setIsDeployingAngel(false);
    }
  };

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
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Opportunities
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {totalAvailable} houses need rent support · UGX {totalRentNeeded.toLocaleString()} total
          </p>
        </div>
        
        {/* Wallet Balance Display Metric */}
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 hidden md:block">
           <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-right">Available Capital</p>
           <p className="font-black text-slate-900">UGX {walletBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* ──────────────── ANGEL POOL PREMIUM UI ──────────────── */}
      <div className="mb-10 w-full rounded-[24px] overflow-hidden border border-slate-800 relative bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row">
        {/* Decorative Graphic Layer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-screen filter blur-[80px] opacity-10 pointer-events-none -translate-x-1/2 translate-y-1/2" />
        
        {/* Left Side: Information */}
        <div className="lg:w-3/5 p-6 md:p-8 lg:p-10 relative z-10 flex flex-col justify-between">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-4">
               <TrendingUp className="w-3 h-3" /> Welile Angel Pool
             </div>
             <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Long-Term Impact. <br className="hidden md:block"/>Class-B Equity.</h2>
             <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                Bypass individual property cycles and own a strategic piece of the overall Welile operational treasury. Backed directly by our assurance mechanisms and the aggregation of platform revenues.
             </p>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fund Capitalization</p>
                <p className="font-bold text-lg">UGX {raisedAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target Cap</p>
                <p className="font-bold text-slate-300">UGX {ANGEL_POOL_CAP.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" style={{ width: `${(raisedAmount/ANGEL_POOL_CAP)*100}%` }} />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Investment Panel */}
        <div className="lg:w-2/5 bg-slate-950 p-6 md:p-8 lg:p-10 relative z-10 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-center">
           <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              Purchase Equity <ShieldCheck className="w-5 h-5 text-emerald-500" />
           </h3>
           <p className="text-xs text-slate-500 mb-6 font-medium tracking-wide">1 Share = UGX {PRICE_PER_SHARE.toLocaleString()}</p>
           
           <div className="space-y-4 relative">
             <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Number of Shares</label>
                <div className="relative flex items-center">
                   <input 
                     type="number" 
                     min="1"
                     value={sharesInput}
                     onChange={e => setSharesInput(e.target.value)}
                     className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl px-4 py-3 pb-8 text-xl font-black focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-700 hover:border-slate-700"
                     placeholder="Enter quantity..."
                   />
                   <div className="absolute right-4 text-slate-500 font-bold pointer-events-none">Shares</div>
                </div>
                {sharesInput && (
                   <p className="absolute bottom-3 left-4 text-[10px] text-purple-400 font-bold tracking-widest uppercase">
                     Total: UGX {investmentAmount.toLocaleString()}
                   </p>
                )}
             </div>

             {sharesInput && !isSufficientBalance && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 p-3 rounded-xl border border-rose-400/20 text-xs font-bold">
                   <AlertCircle className="w-4 h-4 shrink-0" />
                   Insufficient Available Capital (Requires UGX {investmentAmount.toLocaleString()})
                </div>
             )}
             
             <button
               onClick={handleAngelPoolInvestment}
               disabled={!isInputValid || !isSufficientBalance || isDeployingAngel}
               className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2"
             >
               {isDeployingAngel ? (
                 <><Loader2 className="w-4 h-4 animate-spin" /> Authorizing Transfer...</>
               ) : (
                 'Deploy Angel Capital'
               )}
             </button>
           </div>
        </div>
      </div>
      
      {/* ──────────────── OPPORTUNITIES GRID ──────────────── */}
      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-4 mt-8 py-2 border-b border-slate-100">
        <h2 className="font-black text-slate-900 tracking-tight text-lg">Current Portfolio Opportunities</h2>
      </div>
      
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
