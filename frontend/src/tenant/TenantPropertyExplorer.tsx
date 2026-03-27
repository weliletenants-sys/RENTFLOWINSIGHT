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
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
         <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Daily Rent Marketplace</h2>
            <p className="text-sm text-gray-500 mt-1">Discover verified apartments calculated identically to your daily revenue cycle.</p>
         </div>
         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <MapPin size={18} className="text-indigo-500" />
            <select 
               className="text-sm font-bold bg-transparent outline-none cursor-pointer"
               value={radiusKm}
               onChange={(e) => setRadiusKm(Number(e.target.value))}
            >
               <option value={2}>Within 2 km</option>
               <option value={5}>Within 5 km</option>
               <option value={10}>Within 10 km</option>
            </select>
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 rounded-3xl h-72 animate-pulse w-full"></div>)}
        </div>
      ) : (
        <>
          {/* We do NOT map PostGIS bounds locally. Leaflet implementation relies purely on Server GeoJSON bounds */}
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-8 text-center mb-8 flex flex-col items-center justify-center">
             <MapPin size={48} className="text-indigo-400 mb-3" />
             <h3 className="text-lg font-bold text-indigo-900">Map Interface Active</h3>
             <p className="text-sm text-indigo-600 max-w-sm mx-auto">Leaflet projection will render bounding box precisely mapping the {properties.length} GeoJSON plots supplied by the server.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => (
              <div key={prop.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:border-indigo-300 transition-colors cursor-pointer group flex flex-col">
                 <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img src={prop.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={prop.title} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                       {prop.distance_km} km away
                    </div>
                 </div>
                 <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">{prop.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                       <Calendar size={14} /> Market Rent: UGX {prop.monthly_rent.toLocaleString()}/mo
                    </div>
                    
                    <div className="mt-auto bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                       <div>
                          <p className="text-xs font-bold text-gray-500 mb-0.5">Calculated Daily Rate</p>
                          <p className="text-xl font-black text-indigo-600">UGX {prop.daily_rate.toLocaleString()}</p>
                       </div>
                       <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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
