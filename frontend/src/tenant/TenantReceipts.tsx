import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Camera, FileText, CheckCircle2, Clock, Upload, X } from 'lucide-react';

export default function TenantReceipts() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptImg, setReceiptImg] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [receipts, setReceipts] = useState([
    { id: 1, store: 'Mega Standard Supermarket', date: '2026-03-25', amount: 125000, status: 'approved', bonus: '+ 5,000 UGX Limit' },
    { id: 2, store: 'Capital Shoppers', date: '2026-03-20', amount: 84000, status: 'pending', bonus: 'Processing...' }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptImg(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!receiptImg) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setReceipts([{ id: Date.now(), store: 'New Shopping Receipt', date: new Date().toISOString().split('T')[0], amount: 0, status: 'pending', bonus: 'Processing...' }, ...receipts]);
      setReceiptImg(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-20 px-6 md:px-12 relative rounded-b-[3rem] shadow-lg shadow-purple-600/20 dark:shadow-none transition-colors duration-300">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-wide">My Receipts</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-12 relative z-10 flex flex-col gap-6 items-center">
         
         {/* Upload Card */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center pt-8 transition-colors duration-300">
           <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 shadow-inner transition-colors">
              <Gift size={32} />
           </div>
           
           <h2 className="text-xl font-black text-slate-800 dark:text-white text-center tracking-tight mb-2 transition-colors">Turn Receipts Into Credit</h2>
           <p className="text-slate-500 dark:text-slate-400 text-center text-[13px] leading-relaxed mb-8 max-w-sm transition-colors">
              Upload your daily shopping receipts to proactively build a stronger financial profile and instantly unlock higher access limits to your rent credit.
           </p>

           <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
           />

           {!receiptImg ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full border-2 border-dashed border-purple-200 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-700/50 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all bg-slate-50 dark:bg-slate-700/30 group"
             >
                <Camera size={32} strokeWidth={1.5} className="text-purple-400 dark:text-slate-500 mb-3 group-hover:scale-110 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all" />
                <span className="text-[13.5px] font-extrabold text-purple-600 dark:text-slate-400 group-hover:dark:text-purple-400 tracking-wide transition-colors">Scan or Upload Receipt</span>
             </div>
           ) : (
             <div className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50 dark:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm transition-colors">
                      <FileText strokeWidth={1.5} className="text-slate-400 dark:text-slate-500" />
                   </div>
                   <div className="overflow-hidden flex-1">
                      <p className="text-[13.5px] font-bold text-slate-800 dark:text-white truncate transition-colors">{receiptImg.name}</p>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors">{(receiptImg.size / 1024).toFixed(1)} KB</p>
                   </div>
                   <button onClick={() => setReceiptImg(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 transition-colors"><X size={20}/></button>
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 dark:shadow-none hover:bg-purple-600 dark:hover:bg-[#5a2e9d] transition-all disabled:opacity-70 disabled:translate-y-0 hover:-translate-y-0.5 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isUploading ? <span className="animate-pulse">Processing...</span> : <><Upload size={18}/> Submit for Verification</>}
                </button>
             </div>
           )}

         </div>

         {/* History Card */}
         <div className="w-full flex-1 mb-8">
            <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-4 transition-colors">Verification History</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[1.75rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors duration-300">
               {receipts.map((r, i) => (
                 <div key={r.id} className={`p-4 flex items-center justify-between transition-colors ${i !== receipts.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${r.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400'}`}>
                          {r.status === 'approved' ? <CheckCircle2 size={18}/> : <Clock size={18}/>}
                       </div>
                       <div>
                          <p className="text-[13.5px] font-bold text-slate-800 dark:text-white transition-colors">{r.store}</p>
                          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 transition-colors">{r.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[12.5px] font-black transition-colors ${r.status === 'approved' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>{r.bonus}</p>
                       {r.amount > 0 && <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-0.5 transition-colors">Recorded</p>}
                    </div>
                 </div>
               ))}
               {receipts.length === 0 && (
                 <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">No receipts uploaded yet.</div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
}
