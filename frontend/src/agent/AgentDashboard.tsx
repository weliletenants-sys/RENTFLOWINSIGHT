import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentDailyOpsCard from './components/AgentDailyOpsCard';
import VisitPaymentWizard from './components/VisitPaymentWizard';
import { useOfflineAgentDashboard } from '../hooks/useOfflineAgentDashboard';
import { ArrowRight, Navigation, ShieldAlert, Clock } from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { isOnline } = useOfflineAgentDashboard();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  
  // MOCK KYC STATUS: 'NONE' | 'UNDER_REVIEW' | 'APPROVED'
  const [kycStatus] = useState<'NONE' | 'UNDER_REVIEW' | 'APPROVED'>('NONE');
  
  return (
    <div className="flex flex-col gap-4 -mt-2 relative z-10">
      
      {!isOnline && (
        <div className="bg-amber-50 text-amber-800 text-xs py-2 px-4 text-center font-medium rounded-xl border border-amber-200 shadow-sm animate-pulse">
          You are currently offline. Field operations may be restricted.
        </div>
      )}

      {/* KYC Banner */}
      {kycStatus === 'NONE' && (
        <div className="bg-blue-50 text-blue-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-blue-200 shadow-sm flex items-center justify-center gap-2">
          <ShieldAlert size={16} /> Complete your KYC verification before withdrawing your earnings.
        </div>
      )}
      {kycStatus === 'UNDER_REVIEW' && (
        <div className="bg-amber-50 text-amber-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-amber-200 shadow-sm flex items-center justify-center gap-2">
          <Clock size={16} /> Your KYC verification is being reviewed. Expected time: 24-48 hours.
        </div>
      )}

      <div className="flex flex-col gap-6">
        
        {/* Dashboard Overview Widgets */}
        <div className="grid grid-cols-2 gap-3 mt-4">
           {/* Wallet Balance */}
           <div className="bg-white rounded-2xl p-4 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Wallet Balance</span>
              <span className="text-xl font-black text-gray-900 tracking-tight">UGX 0</span>
           </div>
           
           {/* Commission Earned */}
           <div className="bg-white rounded-2xl p-4 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Today's Earnings</span>
              <span className="text-xl font-black text-gray-900 tracking-tight">UGX 0</span>
           </div>
           
           {/* Referral Performance */}
           <div className="col-span-2 bg-white rounded-2xl p-4 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Referral Performance</span>
                <span className="text-xs text-gray-400 font-medium">Earn UGX 10k per agent</span>
              </div>
              <span className="text-sm font-bold text-[#4A3AFF] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">0 Invites</span>
           </div>
        </div>

        {/* KYC Call to Action Section */}
        {kycStatus === 'NONE' && (
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 shadow-[0_4px_20px_-5px_rgba(74,58,255,0.15)] border border-[#4A3AFF]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A3AFF]/5 rounded-full blur-2xl -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 text-[#4A3AFF] p-2 rounded-xl">
                  <ShieldAlert size={20} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Verify Your Identity</h3>
              </div>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                You must complete the KYC process and submit your National ID to unlock the agent float wallet and withdraw cash.
              </p>
              <button 
                onClick={() => navigate('/agent-kyc')}
                className="w-full bg-[#4A3AFF] hover:bg-[#3427AC] text-white py-3.5 rounded-[1rem] font-bold text-sm shadow-lg shadow-[#4A3AFF]/30 transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Start KYC Verification <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* Withdraw Button */}
        <button 
          disabled={kycStatus !== 'APPROVED'}
          className={`w-full py-4 rounded-xl font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 transition ${
            kycStatus === 'APPROVED' 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
          }`}
        >
          Withdraw Earnings {kycStatus === 'APPROVED' ? <ArrowRight size={18} /> : <LockIcon />}
        </button>

        <div className="my-2 border-t border-gray-200" />

        {/* Daily Operations Summary Card (Existing functionality) */}
        <AgentDailyOpsCard />

        {/* Invest for Partner Button */}
        <button 
          onClick={() => {
            if (kycStatus === 'APPROVED') {
              alert('Opening Invest for Partner flow');
              setIsInvestModalOpen(true);
            }
          }}
          disabled={kycStatus !== 'APPROVED'}
          className={`w-full py-5 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 transition group relative overflow-hidden mb-2 ${
             kycStatus === 'APPROVED'
               ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-[0.98]'
               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl border border-white/20">
              <Navigation size={24} strokeWidth={2} />
            </div>
            <span className="font-bold text-lg tracking-wide">Invest for Partner</span>
          </div>
        </button>

        {/* Visit Tenant Button */}
        <button 
          onClick={() => setIsWizardOpen(true)}
          disabled={kycStatus !== 'APPROVED'}
          className={`w-full py-5 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 transition group relative overflow-hidden ${
             kycStatus === 'APPROVED'
               ? 'bg-[#512DA8] hover:bg-[#45229B] text-white shadow-[0_8px_20px_-6px_rgba(81,45,168,0.5)] active:scale-[0.98]'
               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Navigation size={24} fill="currentColor" strokeWidth={1} />
            </div>
            <span className="font-bold text-lg tracking-wide">Visit Tenant</span>
          </div>
        </button>

      </div>

      <VisitPaymentWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
           <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
             <h3 className="font-bold text-lg mb-2">Invest for Partner</h3>
             <p className="text-sm text-gray-500 mb-4">You are acting on behalf of a partner to invest into the Rent Pool.</p>
             <button onClick={() => setIsInvestModalOpen(false)} className="bg-gray-200 w-full py-2 rounded-lg font-bold">Close</button>
           </div>
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
