import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommissionWalletCard from './components/CommissionWalletCard';
import RecruitmentProgressCard from './components/RecruitmentProgressCard';
import AgentToolsGrid from './components/AgentToolsGrid';
import VisitPaymentWizard from './components/VisitPaymentWizard';
import AgentDepositDialog from './components/dialogs/AgentDepositDialog';
import AgentWithdrawalDialog from './components/dialogs/AgentWithdrawalDialog';
import AgentTopUpTenantDialog from './components/dialogs/AgentTopUpTenantDialog';
import AgentRegisterUserDialog from './components/dialogs/AgentRegisterUserDialog';
import { useOfflineAgentDashboard } from '../hooks/useOfflineAgentDashboard';
import { ShieldAlert, Clock } from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { isOnline } = useOfflineAgentDashboard();
  
  // Dialog States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // MOCK KYC STATUS: 'NONE' | 'UNDER_REVIEW' | 'APPROVED'
  const [kycStatus] = useState<'NONE' | 'UNDER_REVIEW' | 'APPROVED'>('NONE');
  
  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Offline Alert */}
      {!isOnline && (
        <div className="bg-amber-50 text-amber-800 text-xs py-2 px-4 text-center font-medium rounded-xl border border-amber-200 shadow-sm animate-pulse">
          You are currently offline. Field operations may be restricted.
        </div>
      )}

      {/* KYC Banner Alerts */}
      {kycStatus === 'NONE' && (
        <div 
          onClick={() => navigate('/agent-kyc')}
          className="bg-blue-50 text-blue-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-blue-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition"
        >
          <ShieldAlert size={16} /> Tap to complete KYC verification to unlock withdraws.
        </div>
      )}
      {kycStatus === 'UNDER_REVIEW' && (
        <div className="bg-amber-50 text-amber-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-amber-200 shadow-sm flex items-center justify-center gap-2">
          <Clock size={16} /> KYC under review. Expected time: 24h.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column Data Components */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          {/* Wallet Banner */}
          <CommissionWalletCard 
            balance={12000} 
            onDeposit={() => setIsDepositOpen(true)}
            onWithdraw={() => {
              if (kycStatus === 'APPROVED') {
                 setIsWithdrawalOpen(true);
              } else {
                 alert('You must complete KYC verification before withdrawing commissions.');
                 navigate('/agent-kyc');
              }
            }}
            onTransfer={() => setIsTopUpOpen(true)}
          />

          {/* Recruitment Progress */}
          <RecruitmentProgressCard 
            totalClients={128}
            pendingPayments={36}
            conversionRate={64}
          />
        </div>
        
        {/* Right Column Action Tools */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">Agent Toolkit</h2>
          <AgentToolsGrid 
            onNewClientClick={() => setIsRegisterOpen(true)}
          />
        </div>

      </div>


      {/* Feature Modals & Dialogs */}
      <AgentDepositDialog isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <AgentWithdrawalDialog isOpen={isWithdrawalOpen} onClose={() => setIsWithdrawalOpen(false)} availableBalance={12000} />
      <AgentTopUpTenantDialog isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <AgentRegisterUserDialog isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <VisitPaymentWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Existing Proxy Invest Modal Placeholder */}
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
