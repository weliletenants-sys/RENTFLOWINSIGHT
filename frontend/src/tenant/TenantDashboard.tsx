import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import WalletCard from './components/WalletCard';
import RentProgressCard from './components/RentProgressCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import { useAuth } from '../contexts/AuthContext';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- MOCK DATA LAYER ---
  const [wallet] = useState({
    balance: 24000
  });

  const [activeRent] = useState({
    amountPaid: 123000,
    totalRent: 185000,
    daysLeft: 8,
    remainingAmount: 65000,
    currentMonth: 'June 2024'
  });

  // --- STATE LAYER ---
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <div className="bg-[#f7f6f8] min-h-screen font-sans text-slate-900">
      <div className="w-full bg-white min-h-screen flex flex-col">
        
        {/* Header Section */}
        <DashboardHeader 
          user={{
            fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson',
            role: 'Tenant',
            isVerified: true,
            avatarUrl: ''
          }} 
          onAvatarClick={() => navigate('/settings')} 
          onNotificationClick={() => console.log('Notifications')}
        />

        <main className="flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <div className="flex flex-col gap-6">
            {/* Wallet Card */}
            <WalletCard 
              balance={wallet.balance} 
              onDeposit={() => setIsWalletOpen(true)}
              onWithdraw={() => setIsWalletOpen(true)}
              onTransfer={() => setIsWalletOpen(true)}
            />
          </div>

          <div className="flex flex-col gap-6 xl:col-span-2">
            {/* Rent Progress Section */}
            <RentProgressCard 
              amountPaid={activeRent.amountPaid}
              totalRent={activeRent.totalRent}
              daysLeft={activeRent.daysLeft}
              remainingAmount={activeRent.remainingAmount}
              currentMonth={activeRent.currentMonth}
            />

            {/* Quick Actions / Recent */}
            <RecentActivitiesCard />
          </div>

        </main>



        {/* Action Sheets */}
        <FullScreenWalletSheet 
          isOpen={isWalletOpen} 
          onClose={() => setIsWalletOpen(false)} 
          balance={wallet.balance}
        />
      </div>
    </div>
  );
}
