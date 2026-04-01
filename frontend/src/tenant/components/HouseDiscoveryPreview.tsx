import { Search, MapPin, Building2, Flame } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import AvailableHousesSheet from './AvailableHousesSheet';

export default function HouseDiscoveryPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const dummyHouses = [
    { id: 1, type: "1 Bedroom Studio", location: "Kisaasi, Kampala", price: "USh 450k", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", tag: "Hot Deal" },
    { id: 2, type: "2 Bedroom Condo", location: "Ntinda, Kampala", price: "USh 900k", img: "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=400&q=80", tag: "AI Match" },
    { id: 3, type: "Single Room", location: "Makerere Kikoni", price: "USh 250k", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80", tag: "Near You" }
  ];

  // Auto-scrolling slideshow effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollContainer.scrollLeft >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           // Scroll right by approximately one card width plus gap (300px)
           scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="bg-[#21262d] rounded-2xl shadow-lg p-8 lg:p-10 relative overflow-hidden flex flex-col border border-slate-700 w-full col-span-1 lg:col-span-8 group/slider">
       {/* Ambient glow inherited from Precision Mockup */}
       <div className="absolute left-0 bottom-0 w-full h-[150%] opacity-20 pointer-events-none" style={{
         background: 'radial-gradient(circle at top left, #3b82f6, transparent 60%)'
       }}></div>

       <div className="flex justify-between items-end mb-8 relative z-10">
         <div>
           <div className="flex items-center gap-3 mb-2">
             <Search className="w-5 h-5 text-blue-400" />
             <h3 className="text-[11px] font-bold text-blue-400 tracking-widest uppercase">House Discovery Network</h3>
           </div>
           <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
             Find your next home
           </h2>
         </div>
         <button 
           onClick={() => setIsSheetOpen(true)}
           className="text-sm font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1 group pb-1"
         >
           Open Marketplace <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
         </button>
       </div>

       {/* Horizontal Scroll Area */}
       <div 
         ref={scrollRef}
         className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x relative z-10 w-full hover:[animation-play-state:paused]"
       >
         
         {dummyHouses.map(house => (
           <div key={house.id} className="min-w-[280px] sm:min-w-[320px] bg-[#2a303c] rounded-2xl overflow-hidden border border-slate-700 shadow-md group cursor-pointer hover:border-blue-500 transition-colors snap-start flex flex-col">
              <div className="h-[160px] w-full relative overflow-hidden">
                 <img src={house.img} alt={house.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                   {house.tag === 'Hot Deal' ? <Flame className="w-3 h-3 text-red-500" /> : <SparkleIcon />}
                   {house.tag}
                 </div>
              </div>
              
              <div className="p-5 flex flex-col gap-3">
                 <div className="flex justify-between items-start gap-4">
                   <h4 className="text-white font-bold text-lg leading-tight truncate">{house.type}</h4>
                   <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 text-xs rounded-md border border-emerald-400/20 whitespace-nowrap">{house.price}</span>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto pt-2">
                   <div className="flex items-center gap-1.5 text-[#94a3b8] text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5" /> <span className="truncate max-w-[120px]">{house.location}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[#94a3b8] text-xs font-semibold">
                      <Building2 className="w-3.5 h-3.5" /> Welile Certified
                   </div>
                 </div>
              </div>
           </div>
         ))}

        </div>
        
        <AvailableHousesSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
     </div>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
