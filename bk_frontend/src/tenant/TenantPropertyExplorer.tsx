import { useState, useEffect } from 'react';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

interface PropertyPayload {
  id: string;
  title: string;
  monthly_rent: number;
  daily_rate: number; // Pre-calculated by backend
  distance_km: number; // Pre-calculated PostGIS sort
  cover_image: string;
  status: 'Available' | 'Reserved';
}

export default function TenantPropertyExplorer() {
  const [properties, setProperties] = useState<PropertyPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(5);

  // DUMMY SIMULATOR: In production, we'd use navigator.geolocation.getCurrentPosition
  // and send { lat, lng, radius } to the backend. We DO NOT FILTER LOCALLY.
  useEffect(() => {
    const fetchGeoMap = async () => {
      setLoading(true);
      try {
        // PROD: await axios.post('/api/v1/tenant/properties/nearby', { lat: 0, lng: 0, radius_km: radiusKm });
        setTimeout(() => {
          setProperties([
             { id: 'PR_819', title: '2BHK Najjera Apartment', monthly_rent: 750000, daily_rate: 34500, distance_km: 1.2, cover_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500', status: 'Available' },
             { id: 'PR_412', title: '1BHK Studio Kyanja', monthly_rent: 400000, daily_rate: 18400, distance_km: 3.4, cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1c24226133?w=500', status: 'Available' }
          ]);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGeoMap();
  }, [radiusKm]);

  return (
    <div className="w-full font-sans antialiased animate-in fade-in duration-500 max-w-6xl mx-auto px-4 py-8 mb-24">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
         <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Daily Rent Marketplace</h2>
            <p className="text-sm font-semibold text-slate-500 mt-2">Discover verified apartments calculated identically to your daily revenue cycle.</p>
         </div>
         <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-[#9234eb] flex items-center justify-center">
               <MapPin size={16} />
            </div>
            <select 
               className="text-sm font-black text-slate-700 bg-transparent outline-none cursor-pointer tracking-wide pr-2"
               value={radiusKm}
               onChange={(e) => setRadiusKm(Number(e.target.value))}
            >
               <option value={2}>Within 2 km Radius</option>
               <option value={5}>Within 5 km Radius</option>
               <option value={10}>Within 10 km Radius</option>
            </select>
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="bg-slate-100 rounded-[2rem] h-96 animate-pulse w-full border border-slate-200"></div>)}
        </div>
      ) : (
        <>
          {/* Map Status Banner */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-[2rem] p-10 text-center mb-10 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
             {/* Decorative glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#9234eb]/5 rounded-full blur-[80px]"></div>

             <div className="w-16 h-16 rounded-full bg-white border border-purple-100 shadow-sm flex items-center justify-center mb-4 relative z-10 text-[#9234eb]">
                <MapPin size={24} />
             </div>
             <h3 className="text-xl font-black text-slate-800 tracking-tight relative z-10">Map Interface Active</h3>
             <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto mt-2 leading-relaxed relative z-10">
                Leaflet projection will render bounding box precisely mapping the <strong className="text-[#9234eb]">{properties.length} GeoJSON plots</strong> supplied by the server.
             </p>
          </div>

          <div className="flex flex-col gap-6">
            {properties.map(prop => (
              <div key={prop.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(146,52,235,0.15)] hover:border-[#9234eb]/30 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row overflow-hidden">
                 
                 {/* Image Container - Left side on desktop */}
                 <div className="w-full sm:w-2/5 md:w-1/3 relative overflow-hidden shrink-0">
                    <img src={prop.cover_image} className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={prop.title} />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[10px] uppercase tracking-widest font-black text-[#9234eb] px-4 py-2 rounded-full shadow-sm">
                       {prop.distance_km} km away
                    </div>
                 </div>

                 {/* Property Details - Right side on desktop */}
                 <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                       <div>
                          <h3 className="font-black text-2xl text-slate-900 leading-tight mb-3 group-hover:text-[#9234eb] transition-colors">{prop.title}</h3>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-lg px-3 py-2 bg-slate-50 w-fit">
                             <Calendar size={12} className="text-slate-500" /> 
                             <span>Market Rent: <span className="text-slate-600">UGX {prop.monthly_rent.toLocaleString()}/mo</span></span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Rate Extractor Bottom Panel */}
                    <div className="mt-auto bg-[#f7f9fa] border border-slate-100 rounded-[1.5rem] p-5 flex justify-between items-center group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/60 mb-1">Calculated Daily Rate</p>
                          <p className="text-2xl font-black text-[#9234eb] leading-none">UGX {prop.daily_rate.toLocaleString()}</p>
                       </div>
                       <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#9234eb] group-hover:bg-[#9234eb] group-hover:text-white transition-all transform group-hover:scale-110">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                 </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
