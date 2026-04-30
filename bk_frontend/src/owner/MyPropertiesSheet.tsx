import { X, Building2, MapPin, CheckCircle2, Clock } from 'lucide-react';


interface MyPropertiesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  properties: any[];
}

export default function MyPropertiesSheet({ isOpen, onClose, onOpenRegister, properties = [] }: MyPropertiesSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-2.5 rounded-xl">
              <Building2 size={22} className="dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Properties</h2>
              <p className="text-sm text-slate-500">Manage your real estate portfolio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {properties.length === 0 ? (
            <div className="text-center p-6 text-slate-500">No properties found. Add one below.</div>
          ) : properties.map((property) => (
            <div key={property.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white dark:bg-slate-800/50 p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 relative">
                  <img src={property.imageUrl} alt="Property" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{property.address}</span>
                    {property.status === 'verified' ? (
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Clock size={16} className="text-amber-500 flex-shrink-0" />
                    )}
                  </h3>
                  
                  <div className="mt-2 text-sm text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> Units</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{property.occupied} / {property.units}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monthly Rent Value</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">UGX {(property.totalRentValue).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-purple-600/20"
          >
            Add New Property
          </button>
        </div>
      </div>
    </>
  );
}
