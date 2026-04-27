// Extract standard React tools
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Radar, Navigation, Building2, Wifi, Satellite } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon mapping issue with custom DivIcon for premium styling
const purpleMarker = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; background-color: #9234eb; border-radius: 9999px; opacity: 0.4; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
            <div style="position: relative; width: 12px; height: 12px; background-color: #9234eb; border-radius: 9999px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Mock Geolocation Targets with actual mathematical Lat/Lng
const sectorTargets = [
   { id: 'LL-401', name: 'John Doe', property: 'Najjera Apartments', district: 'Kira Municipality', coords: '0.3692° N, 32.6105° E', position: [0.3692, 32.6105] as [number, number], status: 'Online' },
   { id: 'LL-409', name: 'Grace Wanjiku', property: 'Kololo Heights', district: 'Central Division', coords: '0.3306° N, 32.5898° E', position: [0.3306, 32.5898] as [number, number], status: 'Offline' },
   { id: 'LL-415', name: 'Michael Kasule', property: 'Kyanja Villas', district: 'Nakawa', coords: '0.3850° N, 32.6050° E', position: [0.3850, 32.6050] as [number, number], status: 'Online' },
   { id: 'LL-422', name: 'David Ochieng', property: 'Ntinda Complex', district: 'Nakawa', coords: '0.3542° N, 32.6167° E', position: [0.3542, 32.6167] as [number, number], status: 'Syncing' },
   { id: 'LL-438', name: 'Sarah Namutebi', property: 'Muyenga View', district: 'Makindye', coords: '0.2982° N, 32.6111° E', position: [0.2982, 32.6111] as [number, number], status: 'Online' },
];

export default function AgentLandlordMap() {
  const navigate = useNavigate();
  const [activeTarget, setActiveTarget] = useState<string | null>('LL-401');
  
  // Raw Leaflet Referencing
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Initialize Native Leaflet
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Mount Map once
    if (!mapInstance.current) {
       mapInstance.current = L.map(mapRef.current, {
          center: [0.3476, 32.5825],
          zoom: 12,
          zoomControl: false 
       });

       L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
       }).addTo(mapInstance.current);

       // Hydrate Map with Markers
       sectorTargets.forEach(target => {
          const marker = L.marker(target.position, { icon: purpleMarker }).addTo(mapInstance.current!);
          
          // Custom HTML Popup
          const popupHtml = `
             <div style="font-family: inherit; display: flex; flex-direction: column; gap: 4px; padding: 4px; min-width: 140px;">
                <h4 style="font-weight: 900; color: #1e293b; font-size: 12px; margin: 0;">${target.name}</h4>
                <p style="font-weight: 700; color: #64748b; font-size: 10px; margin: 0;">${target.property}</p>
                <p style="font-weight: 900; color: #94a3b8; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${target.district}</p>
             </div>
          `;
          marker.bindPopup(popupHtml, { className: 'custom-popup pointer-events-none' });
          
          marker.on('click', () => {
             setActiveTarget(target.id);
          });
       });
    }

    // Cleanup
    return () => {
       if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
       }
    };
  }, []);

  // Synchronize Framework State -> Map Camera
  useEffect(() => {
     if (activeTarget && mapInstance.current) {
        const target = sectorTargets.find(t => t.id === activeTarget);
        if (target) {
           mapInstance.current.flyTo(target.position, 15, { animate: true, duration: 1.5 });
        }
     }
  }, [activeTarget]);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20 overflow-hidden">
      
      {/* Global CSS to fix leaflet z-index clobbering */}
      <style>{`
        .leaflet-container { z-index: 0 !important; cursor: crosshair; }
        .leaflet-control-container { opacity: 0.8; }
        .leaflet-popup-content-wrapper { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .custom-popup .leaflet-popup-close-button { display: none; }
      `}</style>

      {/* Background ambient light */}
      <div className="fixed top-[-5%] right-[-10%] w-[50rem] h-[50rem] bg-[#9234eb]/5 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                 <ArrowLeft size={24} />
              </button>
              <div>
                  <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Sector Map</h1>
                  <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest flex items-center gap-1.5"><Satellite size={12} /> Live Link Active</p>
              </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
              <Wifi size={16} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">OSM-Link Active</span>
           </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 relative z-10 h-[calc(100vh-140px)] min-h-[600px] flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar - Territory Directory */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4 h-auto lg:h-full">
           
           {/* Geo-KPI Hero */}
           <div className="bg-gradient-to-br from-[#9234eb] to-[#6a15ba] rounded-[2rem] p-6 border border-white/10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                 <Radar size={120} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Live Tracking Targets</p>
              <h2 className="text-4xl font-black mb-4 tracking-tighter shadow-sm">{sectorTargets.length} <span className="text-lg opacity-60">Asset Links</span></h2>
              <div className="flex items-center gap-2 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                 <Navigation size={14} className="text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none text-emerald-100">Synchronized</span>
              </div>
           </div>

           {/* Scrolling Asset List */}
           <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                 <MapPin size={18} className="text-[#9234eb]" />
                 <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Sector Directory</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
                 {sectorTargets.map((target) => (
                    <button 
                       key={target.id}
                       onClick={() => setActiveTarget(target.id)}
                       className={`w-full text-left p-4 rounded-xl border transition-all ${
                          activeTarget === target.id 
                          ? 'bg-purple-50 border-purple-200 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                       }`}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold ${activeTarget === target.id ? 'text-[#9234eb]' : 'text-slate-800'}`}>{target.name}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${
                             target.status === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                             target.status === 'Syncing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                               target.status === 'Online' ? 'bg-emerald-500 animate-pulse' :
                               target.status === 'Syncing' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            {target.status}
                          </span>
                       </div>
                       <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                          <Building2 size={12} className="opacity-50" /> {target.property}
                       </p>
                       <p className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                          {target.coords}
                       </p>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Dashboard - Live OSM Map */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-0 mt-4 lg:mt-0 p-1">
           
           <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
              <h3 className="text-slate-800 font-black text-xl tracking-wide shadow-slate-100 drop-shadow-md bg-white/60 px-2 py-0.5 rounded-lg backdrop-blur-sm w-fit">Live Tracking</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9234eb] bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg w-fit shadow-sm">
                 OpenStreetMap Core
              </p>
           </div>

           {/* The Massive Live Map Container using Raw DOM Ref */}
           <div className="absolute inset-1 rounded-[1.8rem] overflow-hidden z-0 bg-slate-100 border border-slate-200 shadow-inner">
               <div ref={mapRef} className="w-full h-full" />
           </div>

        </div>

      </main>
    </div>
  );
}
