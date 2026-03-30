import { MapPin, TrendingUp, CalendarDays, ShieldCheck } from 'lucide-react';

export type OpportunityStatus = 'available' | 'urgent' | 'taken';

export interface VirtualHouseProps {
  id: string;
  name: string;
  location: string;
  image: string;
  rentRequired: number;
  bedrooms: number;
  status: OpportunityStatus;
  postedDate: string;
  onFundClick: (id: string) => void;
}

export default function VirtualHouseCard({
  id,
  name,
  location,
  image,
  rentRequired,
  bedrooms,
  status,
  postedDate,
  onFundClick
}: VirtualHouseProps) {
  // Synthetic calculations for highly engaging UI prototype
  const expectedYield = 14.5; // Constant base yield mock
  const durationMonths = 3; 
  // Generate a deterministic random funding percentage based on ID characters
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const percentFunded = status === 'taken' ? 100 : (seed % 65) + 15; // 15% to 80%

  const riskProfile = (seed % 3) === 0 ? 'Medium' : 'Low';

  return (
    <div className={`bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 group flex flex-col h-full relative cursor-pointer
      ${status === 'taken' ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-xl hover:-translate-y-1'}
    `}>
      {/* Risk Badge & Status Container */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-md flex items-center gap-1.5 border w-max
          ${riskProfile === 'Low' ? 'bg-emerald-500/90 text-white border-emerald-400/30' : 
            'bg-amber-500/90 text-white border-amber-400/30'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {riskProfile} Risk
        </span>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md
          ${status === 'urgent' ? 'bg-rose-500 text-white' : 
            status === 'available' ? 'bg-emerald-100 text-emerald-800' : 
            'bg-slate-800 text-white'}`}
        >
          {status}
        </span>
      </div>

      {/* Image Header */}
      <div className="h-48 relative overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent z-0"></div>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
        />
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
          <div>
            <h3 className="text-white font-black text-lg tracking-tight drop-shadow-md leading-tight truncate w-[200px]">{name}</h3>
            <p className="text-white/80 text-xs font-medium flex items-center gap-1.5 mt-1 drop-shadow-md truncate w-[200px]">
              <MapPin className="w-3.5 h-3.5" /> {location}
            </p>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col relative bg-white">
        <div className="grid grid-cols-2 gap-4 mb-6 relative">
          <div className="absolute -inset-x-5 top-1/2 h-px bg-slate-50"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-slate-50"></div>
          
          <div className="pt-2 pb-2">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-purple-500" /> Est. Yield</p>
            <p className="text-lg font-black text-slate-800">{expectedYield}%</p>
          </div>
          <div className="pt-2 pb-2 pl-4">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3 text-blue-500" /> Lock-in</p>
            <p className="text-lg font-black text-slate-800">{durationMonths} Mo</p>
          </div>
        </div>

        {/* Progress Bar & CTA */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest"><span className="text-slate-400 font-medium">Pool:</span> UGX {(rentRequired / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{percentFunded}% Filled</p>
          </div>
          
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 relative"
              style={{ width: `${percentFunded}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onFundClick(id); }}
            disabled={status === 'taken'}
            className={`w-full font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:-translate-y-0.5 transition-all shadow-md group-hover:shadow-lg focus:ring-4 focus:ring-purple-500/20 active:scale-[0.98]
             ${status === 'taken' 
               ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed transform-none hover:-translate-y-0' 
               : 'bg-slate-900 text-white hover:bg-slate-800 group-hover:bg-purple-700'}`}
          >
            {status === 'taken' ? 'Closed' : 'Deploy Capital'}
          </button>
        </div>
      </div>
    </div>
  );
}
