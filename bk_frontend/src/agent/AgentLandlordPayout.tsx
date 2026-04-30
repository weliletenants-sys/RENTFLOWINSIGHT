import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Camera, UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AgentLandlordPayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gpsObtained, setGpsObtained] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  
  // Simulated location for UX feedback
  const [locationStatus, setLocationStatus] = useState<string>('Standing by for location ping...');

  const handleCaptureGPS = () => {
    setLocationStatus('Pinging satellite network...');
    setTimeout(() => {
        setGpsObtained(true);
        setLocationStatus('GPS Lock acquired within 15 meters of property center point.');
        toast.success('Location verified securely.');
    }, 1500);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setReceiptUploaded(true);
        toast.success('Receipt photo attached.');
    }
  };

  const handleSubmitCompliance = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        toast.success('Funds released to Landlord. UGX 5,000 bonus added to your wallet!');
        navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-24 top-0 left-0 fixed w-full z-50 overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
             <ArrowLeft size={24} />
          </button>
          <div>
              <h1 className="text-xl font-bold font-outfit text-slate-900 dark:text-white leading-none mb-1">Finalize Payout</h1>
              <p className="text-xs font-medium text-slate-500">Compliance & Proof of Handover</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        
        {/* Important Alert */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 p-5 rounded-2xl flex gap-3">
           <ShieldAlert className="text-red-500 shrink-0 mt-0.5" />
           <div>
              <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Strict Compliance Protocol</h3>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                 You are about to authorize the final release of funds to the Landlord. You must be physically present at the property and upload a counter-signed cash receipt to proceed. Falsification will trigger a complete suspension of your agent float.
              </p>
           </div>
        </div>

        {/* GPS Check-in Module */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           <div className={`p-1 text-center text-xs font-bold text-white transition-colors duration-500 ${gpsObtained ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              {gpsObtained ? 'GEO-FENCE SECURED' : 'UNVERIFIED LOCATION'}
           </div>
           <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5"><MapPin size={16} className="text-[#6c11d4]" /> GPS Validation</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">{locationStatus}</p>
                 </div>
                 {gpsObtained ? (
                    <div className="size-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 flex items-center justify-center">
                       <CheckCircle2 size={24} />
                    </div>
                 ) : (
                   <button 
                     onClick={handleCaptureGPS}
                     className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                   >
                     Ping Location
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Receipt Upload Module */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           <div className={`p-1 text-center text-xs font-bold text-white transition-colors duration-500 ${receiptUploaded ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              {receiptUploaded ? 'RECEIPT LOGGED' : 'AWAITING ATTACHMENT'}
           </div>
           <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 mb-4"><Camera size={16} className="text-[#6c11d4]" /> Photographic Proof</h3>
              
              {!receiptUploaded ? (
                 <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <UploadCloud className="text-slate-400 mb-3" size={32} />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">Tap to capture / upload</span>
                    <span className="text-xs text-slate-400 text-center">Ensure the Landlord's signature and the cash hand-over amount are clearly visible in the frame.</span>
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleSimulateUpload} />
                 </label>
              ) : (
                 <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                       <Camera size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">proof_of_payment_001.jpg</p>
                       <p className="text-xs text-emerald-600 dark:text-emerald-500">2.4 MB • Successfully encrypted</p>
                    </div>
                 </div>
              )}
           </div>
        </div>

        <button 
          onClick={handleSubmitCompliance}
          disabled={!gpsObtained || !receiptUploaded || loading}
          className="w-full bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
        >
          {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={20} />}
          <span>{loading ? 'Committing compliance...' : 'Finalize & Claim Bonus'}</span>
        </button>

      </main>
    </div>
  );
}
