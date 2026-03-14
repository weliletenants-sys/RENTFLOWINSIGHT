import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function AgentAgreement() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      alert("You must agree to the terms to create your account.");
      return;
    }
    // Proceed to dashboard, which will intercept with KYC prompt
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-8 flex justify-center items-center relative overflow-hidden font-sans">
      <div className="w-full sm:max-w-3xl min-h-screen sm:min-h-0 sm:h-[85vh] bg-white relative flex flex-col shadow-2xl sm:rounded-[2rem] overflow-hidden z-10">

        <div className="flex-1 flex flex-col pt-12 sm:pt-16 px-6 sm:px-10 pb-6 relative z-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Agent Agreement</h1>
          </div>

          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-6 overflow-y-auto w-full text-sm text-gray-700 leading-relaxed space-y-4 shadow-inner mb-6 custom-scrollbar">
            <h2 className="font-bold text-gray-900">1. Verification Duties</h2>
            <p>
              As a Welile Field Agent, you are responsible for accurately verifying 
              tenant properties, confirming GPS coordinates, and ensuring landlord identity 
              via platform PINs. Falsifying verification data will result in immediate termination.
            </p>
            <h2 className="font-bold text-gray-900 mt-6">2. Float & Collections</h2>
            <p>
              You may be required to handle cash collections for tenants without smartphones. 
              Any shortfalls or missing funds will be recorded as accumulated debt against your virtual wallet.
            </p>
            <h2 className="font-bold text-gray-900 mt-6">3. KYC Validation</h2>
            <p>
              You must complete the rigorous KYC (Know Your Customer) process and have it approved 
              by administration before you can withdraw any earned commissions.
            </p>
            <p className="mt-4 italic">
              Please read our full Agent Terms of Service at welile.com/terms/agent for complete details.
            </p>
          </div>

          <div className="mt-auto shrink-0 pt-2">
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={() => setAgreed(!agreed)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-md cursor-pointer accent-[#4A3AFF]" 
                />
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition mt-[2px]">
                I agree to the Welile Agent Agreement
              </span>
            </label>

            <button 
              onClick={handleContinue}
              disabled={!agreed}
              className={`w-full py-4 rounded-[1.2rem] font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition ${agreed ? 'bg-[#4A3AFF] hover:bg-[#3427AC] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Create Account <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
