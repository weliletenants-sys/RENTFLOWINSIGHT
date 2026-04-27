import { useState } from 'react';
import { ShieldCheck, UserPlus, Phone, MapPin } from 'lucide-react';
import RegisterLandlordDialog from './RegisterLandlordDialog';

interface LandlordProfile {
  name: string;
  phone: string;
  location: string;
  status: 'verified' | 'pending';
}

export default function MyLandlordsSection() {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [landlord, setLandlord] = useState<LandlordProfile | null>(null);

  // Note: Normally we'd fetch the landlord directly from the tenant API using the active rent request link

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 lg:p-8 flex flex-col h-full relative overflow-hidden group">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">Your Landlord</h3>
               <p className="text-xs font-medium text-slate-500 mt-1">Property management link</p>
             </div>
          </div>
        </div>

        {landlord ? (
          <div className="flex flex-col flex-1">
             <div className="rounded-xl border border-slate-100 p-4 bg-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {landlord.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900 leading-none">{landlord.name}</p>
                    {landlord.status === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {landlord.phone}</p>
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
                <MapPin className="w-3.5 h-3.5" /> Property Location: {landlord.location}
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center flex-1 py-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
               <UserPlus className="w-5 h-5 text-slate-400" />
             </div>
             <p className="text-sm font-bold text-slate-700 mb-1">No Landlord Linked</p>
             <p className="text-xs text-slate-400 font-medium px-4 mb-4">Register your landlord to unlock independent rent requests without an Agent.</p>
             <button 
                onClick={() => setShowRegisterDialog(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
             >
               Add Landlord
             </button>
          </div>
        )}
      </div>

      <RegisterLandlordDialog 
         isOpen={showRegisterDialog} 
         onClose={() => setShowRegisterDialog(false)} 
         onSuccess={(newLandlord) => {
           setLandlord(newLandlord);
           setShowRegisterDialog(false);
         }}
      />
    </>
  );
}
