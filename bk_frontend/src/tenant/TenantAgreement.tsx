import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function TenantAgreement() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      alert("You must agree to the terms to continue.");
      return;
    }
    // Proceed to multi-step application form
    navigate('/tenant-onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 sm:p-4 flex justify-center items-center relative overflow-hidden transition-colors duration-300">
      <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-slate-900 relative flex flex-col overflow-hidden z-10 transition-colors duration-300">

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-10 relative z-10 overflow-y-auto w-full max-w-3xl mx-auto">
          
          <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-purple-500/5 dark:shadow-none flex flex-col h-full max-h-[85vh] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center transition-colors">
                <FileText className="text-purple-600 dark:text-purple-400 transition-colors" size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Tenant Agreement</h1>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 overflow-y-auto w-full text-sm text-gray-700 dark:text-slate-300 leading-relaxed space-y-4 shadow-inner dark:shadow-none mb-6 custom-scrollbar transition-colors">
              <h2 className="font-bold text-gray-900 dark:text-white transition-colors">1. Financing Terms</h2>
              <p>
                By proceeding, you acknowledge that Welile is financing your rent on a short-term basis. You agree to repay the advanced rent plus a marketplace access fee.
              </p>
              <h2 className="font-bold text-gray-900 dark:text-white mt-6 transition-colors">2. Daily Repayment</h2>
              <p>
                Repayments are deducted daily starting the day after rent is disbursed. Failure to maintain sufficient wallet balance will trigger fallback deductions to your linked Agent.
              </p>
              <h2 className="font-bold text-gray-900 dark:text-white mt-6 transition-colors">3. Privacy Policy</h2>
              <p>
                We collect identity information strictly for risk assessment and fraud prevention. We do not sell your data to third parties.
              </p>
              <p className="mt-4 italic text-gray-500 dark:text-slate-400 transition-colors">
                Please read our full Terms of Service at welile.com/terms for complete details.
              </p>
            </div>

            <div className="mt-auto shrink-0 pt-2">
              <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={() => setAgreed(!agreed)}
                    className="w-5 h-5 text-purple-600 dark:text-purple-500 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-purple-500 dark:focus:ring-purple-400 rounded cursor-pointer transition-colors" 
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white transition font-medium">
                  I have read and agree to the Tenant Financing Terms and Privacy Policy.
                </span>
              </label>

              <button 
                onClick={handleContinue}
                disabled={!agreed}
                className={`w-full py-4 rounded-[1.2rem] font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition cursor-pointer ${agreed ? 'bg-[#512DA8] dark:bg-[#6b45c2] hover:bg-[#412387] dark:hover:bg-[#5a2e9d] text-white active:scale-[0.98]' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'}`}
              >
                Continue to Application <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
