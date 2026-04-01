import { useState } from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { acceptTenantAgreement } from '../../services/tenantApi';

interface TenantAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TenantAgreementModal({ isOpen, onClose, onSuccess }: TenantAgreementModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);
    try {
      await acceptTenantAgreement({ version: '1.0.0' });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept agreement. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header Block */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900">Welile Tenant Agreement</h2>
              <p className="text-sm text-slate-500 mt-1">Please read and accept the terms to unlock features.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-100 hover:bg-slate-200 rounded-full shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5 text-sm text-slate-700 leading-relaxed shadow-sm">
            <div>
              <strong className="text-slate-900">1. Acceptance of Terms</strong>
              <p className="mt-1">By accessing and using the Welile Insights platform, you enter into a binding agreement with Welile Insights.</p>
            </div>
            
            <div>
              <strong className="text-slate-900">2. Rent Obligations</strong>
              <p className="mt-1">You agree to make timely payments for rent and any advanced credit. Missed payments may affect your credit score and access to future financing on the platform.</p>
            </div>

            <div>
              <strong className="text-slate-900">3. Digital Wallet Use</strong>
              <p className="mt-1">Funds deposited in your Welile Wallet are secure but represent a digital balance. Withdrawals are subject to processing times and provider limits (MTN/Airtel).</p>
            </div>

            <div>
              <strong className="text-slate-900">4. Data Privacy</strong>
              <p className="mt-1">We respect your privacy. Your personal information, financial records, and KYC data will be managed in accordance with our Privacy Policy and local regulations.</p>
            </div>

            <div>
              <strong className="text-slate-900">5. Accuracy of Information</strong>
              <p className="mt-1">You certify that all information provided during registration and KYC verification is accurate and truthful. Providing false information may lead to immediate account suspension.</p>
            </div>

            <div>
              <strong className="text-slate-900">6. Service Fees</strong>
              <p className="mt-1">Certain transactions, such as rent requests and mobile money withdrawals, may incur platform and provider fees. These will always be disclosed prior to confirmation.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl mt-4 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-3 justify-end shrink-0">
          <button 
            onClick={onClose} 
            disabled={isAccepting}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleAccept} 
            disabled={isAccepting}
            className="w-full sm:w-auto bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
          >
            {isAccepting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                I Accept the Terms
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
