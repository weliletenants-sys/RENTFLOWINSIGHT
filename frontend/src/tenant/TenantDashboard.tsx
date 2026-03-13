import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu } from 'lucide-react';

// Context removed intentionally to fix TS errors

// Components
import DashboardHeader from './components/DashboardHeader';
import CreditAccessCard from './components/CreditAccessCard';
import SubscriptionStatusCard from './components/SubscriptionStatusCard';
import WalletCard from './components/WalletCard';
import TenantMenuDrawer from './components/TenantMenuDrawer';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';

export default function TenantDashboard() {
  const navigate = useNavigate();

  // --- MOCK DATA LAYER ---
  const [user] = useState({
    fullName: 'Jane Doe',
    role: 'tenant',
    isVerified: true,
    avatarUrl: ''
  });

  const [wallet] = useState({
    balance: 55000
  });

  const [creditLimit] = useState(2000000);

  const [activeRent] = useState<{
    status: 'pending' | 'approved' | 'funded' | 'disbursed' | 'completed';
    rentFinanced: number;
    totalRepayment: number;
    dailyRepayment: number;
    amountPaid: number;
    daysRemaining: number;
    landlord: string;
  }>({
    status: 'disbursed',
    rentFinanced: 450000,
    totalRepayment: 470000,
    dailyRepayment: 15667,
    amountPaid: 120000,
    daysRemaining: 23,
    landlord: 'Okello Properties'
  });

  // --- STATE LAYER ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // --- ACTIONS ---
  const handleRequestRent = () => {
    // In a real app, check useTenantAgreement() here first
    navigate('/tenant-agreement');
  };

  return (
    <>
      {/* Offline Status - Hidden per request, but the hook is active */}
      {/* {isOffline && <div className="bg-yellow-500...">Offline Mode</div>} */}

      <div className="flex flex-col gap-6 pb-24">
        
        {/* Top Profile Header */}
        <DashboardHeader 
          user={user} 
          onAvatarClick={() => navigate('/settings')} 
        />

        {/* Dynamic Credit Limit */}
        <CreditAccessCard creditLimit={creditLimit} />

        {/* Subscription Tracking (Hero Card) */}
        <SubscriptionStatusCard 
          activeRent={activeRent}
          daysRemaining={activeRent.daysRemaining}
          amountPaid={activeRent.amountPaid}
          totalRepayment={activeRent.totalRepayment}
        />

        {/* Purple Wallet Card */}
        <WalletCard balance={wallet.balance} onClick={() => setIsWalletOpen(true)} />

        {/* Two Main Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button 
            onClick={handleRequestRent}
            className="bg-[#512DA8] border border-[#482D98] text-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition"
          >
            <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">Request</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">Rent</span>
              <ArrowUpRight size={16} strokeWidth={3} />
            </div>
          </button>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 text-gray-700 rounded-[1.5rem] p-4 flex flex-col items-center justify-center shadow-sm active:scale-95 transition hover:shadow-md"
          >
            <Menu size={24} className="mb-1 text-gray-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Menu</span>
          </button>
        </div>

      </div>

      {/* Sheets and Drawers */}
      <TenantMenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      <FullScreenWalletSheet 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
        balance={wallet.balance}
      />
    </>
  );
}
