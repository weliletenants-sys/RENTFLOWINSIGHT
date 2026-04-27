import { useState, useEffect } from 'react';
import { X, ScanLine, UserCheck, ShieldCheck, Camera, Sparkles, Building2, Smartphone } from 'lucide-react';

interface TenantKYCDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

type Step = 'intro' | 'scan_id' | 'scan_face' | 'processing' | 'success';

export default function TenantKYCDialog({ isOpen, onClose, onVerificationComplete }: TenantKYCDialogProps) {
  const [step, setStep] = useState<Step>('intro');
  const [scanProgress, setScanProgress] = useState(0);

  // Auto-progress scanner bars
  useEffect(() => {
    if (step === 'scan_id' || step === 'scan_face' || step === 'processing') {
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5; // Fast bursty chunks
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Transition handler when a scanner hits 100%
  useEffect(() => {
    if (scanProgress >= 100) {
      setTimeout(() => {
        if (step === 'scan_id') setStep('scan_face');
        else if (step === 'scan_face') setStep('processing');
        else if (step === 'processing') setStep('success');
        setScanProgress(0);
      }, 800);
    }
  }, [scanProgress, step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[80] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
        
        {/* Header (Hidden on active scanning for immersion) */}
        {!['scan_id', 'scan_face'].includes(step) && (
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-[#9234eb]" /> AI Identity Profiling
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        {/* --- STEP 1: INTRO --- */}
        {step === 'intro' && (
          <div className="p-8 flex flex-col items-center animate-in slide-in-from-right-4">
             <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 text-[#9234eb] rounded-full flex items-center justify-center mb-6 relative">
                <UserCheck className="w-10 h-10" />
                <Sparkles className="w-4 h-4 absolute top-2 right-2 text-yellow-500" />
             </div>
             
             <h4 className="font-bold text-2xl text-slate-900 dark:text-white mb-3 text-center tracking-tight">Protect Your Account</h4>
             <p className="text-center text-sm font-semibold text-slate-500 mb-8 max-w-[260px] leading-relaxed">
               Rentflow uses AI to verify your National ID against your face. This prevents fraud and unlocks your emergency rent loan limits.
             </p>

             <div className="w-full space-y-3 mb-8">
               <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <ScanLine className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">1. Prepare your National ID Card</span>
               </div>
               <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <Camera className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">2. Ensure good lighting for facial scan</span>
               </div>
             </div>

             <button 
               onClick={() => { setStep('scan_id'); setScanProgress(0); }}
               className="w-full bg-[#9234eb] hover:bg-[#7e2abf] text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
             >
               Start Verification
             </button>
          </div>
        )}

        {/* --- STEP 2: ID SCANNER --- */}
        {step === 'scan_id' && (
          <div className="h-[500px] flex flex-col animate-in fade-in zoom-in-95 bg-slate-900 relative">
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #9234eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
             
             <div className="p-6 pb-2 relative z-10 flex justify-between items-center text-white">
                <span className="font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Step 1 of 2</span>
                <button onClick={onClose}><X size={24} className="text-white/70 hover:text-white" /></button>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <h4 className="font-bold text-white text-xl mb-6">Scan National ID Front</h4>
                
                {/* ID Frame Bounding Box */}
                <div className="w-full h-48 border-[3px] border-dashed border-white/50 rounded-xl relative overflow-hidden backdrop-blur-sm bg-white/5 flex items-center justify-center">
                   {/* Scanning Laser */}
                   <div 
                     className="absolute top-0 left-0 w-full h-1 bg-[#9234eb] shadow-[0_0_15px_#9234eb] transition-all duration-300 ease-out"
                     style={{ top: `${scanProgress}%` }}
                   />
                   <Building2 className="w-16 h-16 text-white/20" />
                </div>
                
                <p className="mt-8 font-bold text-[#9234eb] bg-[#9234eb]/10 px-4 py-2 rounded-full text-sm">
                   {scanProgress < 100 ? 'Align ID within frame...' : 'Document Captured'}
                </p>
             </div>
          </div>
        )}

        {/* --- STEP 3: FACIAL SCANNER --- */}
        {step === 'scan_face' && (
          <div className="h-[500px] flex flex-col animate-in slide-in-from-right-4 bg-slate-900 relative">
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-b from-purple-500/20 to-transparent" />
             
             <div className="p-6 pb-2 relative z-10 flex justify-between items-center text-white">
                <span className="font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Step 2 of 2</span>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <h4 className="font-bold text-white text-xl mb-8">Liveness Check</h4>
                
                {/* Oval Face Frame */}
                <div className="w-48 h-64 border-4 border-[#9234eb] rounded-[100px] relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(146,52,235,0.3)]">
                   {/* Face mesh simulation */}
                   <div 
                     className="absolute bottom-0 left-0 w-full bg-[#9234eb]/20 backdrop-blur-sm transition-all duration-300 ease-out flex items-center justify-center"
                     style={{ height: `${scanProgress}%` }}
                   >
                     {scanProgress > 50 && <ShieldCheck className="text-white/50 w-20 h-20 animate-pulse" />}
                   </div>
                   <Smartphone className="w-12 h-12 text-white/20 absolute z-0" />
                </div>
                
                <p className="mt-8 font-bold text-emerald-400 text-sm">
                   {scanProgress < 100 ? 'Analyzing facial geometry...' : 'Identity Verified'}
                </p>
             </div>
          </div>
        )}

        {/* --- STEP 4: PROCESSING PRELIMINARY DATA --- */}
        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center animate-in fade-in">
             <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-[#9234eb] animate-spin mb-6"></div>
             <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Machine Learning Check...</h4>
             <p className="text-center text-sm font-semibold text-slate-500">
               Cross-referencing National Registry records to validate your details.
             </p>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
               <div className="bg-[#9234eb] h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
             </div>
          </div>
        )}

        {/* --- STEP 5: SUCCESS --- */}
        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center animate-in zoom-in-95">
             <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-emerald-50">
                <ShieldCheck className="w-12 h-12" />
             </div>
             
             <h4 className="font-black text-3xl text-slate-900 dark:text-white mb-2 text-center tracking-tight">Verified!</h4>
             <p className="text-center text-sm font-semibold text-slate-500 px-4 mb-8">
               Your biometric profile and National ID check were successful. You are now officially cleared.
             </p>

             <button 
               onClick={() => {
                  onVerificationComplete();
                  onClose();
               }}
               className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
             >
               Return to Dashboard
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
