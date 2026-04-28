import { X, Search, MapPin, SlidersHorizontal, Store } from 'lucide-react';
import { useState } from 'react';

interface AvailableHousesSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailableHousesSheet({ isOpen, onClose }: AvailableHousesSheetProps) {
  const [activeTab, setActiveTab] = useState<'Map' | 'List'>('List');

  if (!isOpen) return null;

  const houses = [
    { id: 1, type: "1 Bedroom Studio", location: "Kisaasi, Kampala", price: "USh 450k/mo", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", tag: "Hot Deal" },
    { id: 2, type: "2 Bedroom Condo", location: "Ntinda, Kampala", price: "USh 900k/mo", img: "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=400&q=80", tag: "AI Match" },
    { id: 3, type: "Single Room", location: "Makerere Kikoni", price: "USh 250k/mo", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80", tag: "Near You" },
    { id: 4, type: "Double Room Setup", location: "Bweyogerere", price: "USh 350k/mo", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", tag: "Verified" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet panel */}
      <div className="w-full max-w-2xl bg-[#f7f9fc] h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
         
         {/* Header */}
         <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Marketplace</h2>
              </div>
              <p className="text-xs font-medium text-slate-500">Discover Welile Certified rentals</p>
            </div>
            
            <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors group">
              <X className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
         </div>

         {/* Search & Filters */}
         <div className="bg-white px-6 py-4 shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                   placeholder="Search location, house type..."
                 />
               </div>
               <button className="p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                 <SlidersHorizontal className="w-5 h-5" />
               </button>
            </div>

            <div className="flex gap-2 mt-4 bg-slate-100 p-1 rounded-lg">
               <button 
                  onClick={() => setActiveTab('List')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'List' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 List View
               </button>
               <button 
                  onClick={() => setActiveTab('Map')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'Map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Simulation Map
               </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-6 bg-[#f7f9fc]">
            {activeTab === 'List' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {houses.map(house => (
                   <div key={house.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer group flex flex-col">
                      <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                         <img src={house.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={house.type} />
                         <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black text-slate-900 tracking-widest uppercase">
                           {house.tag}
                         </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                         <h4 className="font-bold text-slate-900 text-base mb-1 truncate">{house.type}</h4>
                         <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-3">
                           <MapPin className="w-3.5 h-3.5" /> <span className="truncate">{house.location}</span>
                         </div>
                         <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100">
                           <span className="font-black text-blue-600">{house.price}</span>
                           <button className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
                              View
                           </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="w-full h-full bg-slate-200 rounded-3xl border border-slate-300 relative flex items-center justify-center overflow-hidden">
                 {/* Mock Map Background */}
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply flex flex-wrap" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                 
                 <div className="relative z-10 flex flex-col items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white max-w-sm text-center">
                    <MapPin className="w-10 h-10 text-blue-500 mb-2" />
                    <h3 className="text-lg font-black text-slate-900 mb-1">Map View Simulated</h3>
                    <p className="text-sm font-medium text-slate-600">Google Maps API integration not currently loaded. Switch to List View to browse properties.</p>
                 </div>

                 {/* Simulated map pins */}
                 <div className="absolute top-[30%] left-[20%] w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>
                 <div className="absolute top-[45%] right-[30%] w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg animate-pulse"></div>
                 <div className="absolute bottom-[20%] left-[40%] w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-lg animate-pulse"></div>
              </div>
            )}
         </div>

      </div>
    </div>
  );
}
