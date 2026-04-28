import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

interface NearbyTenantsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NearbyTenantsSheet({ isOpen, onClose }: NearbyTenantsSheetProps) {
  if (!isOpen) return null;

  const tenants = [
    { name: 'Sarah Namukasa', distance: '120m away', address: 'Bwaise Zone 2', status: 'Payment due' },
    { name: 'Joseph K.', distance: '450m away', address: 'Bwaise Industrial', status: 'Up to date' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-50 w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Nearby Clients</h2>
              <p className="text-xs text-gray-500">Based on GPS (500m radius)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button className="w-full bg-white border border-rose-200 text-rose-600 font-bold text-sm py-3 rounded-xl shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 mb-4">
            <Navigation size={16} /> Scan Surroundings Again
          </button>

          {tenants.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{t.name}</h3>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-1 rounded">
                  {t.distance}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{t.address}</p>
              <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">{t.status}</span>
                <span className="text-rose-600 font-bold hover:underline">View Profile</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
