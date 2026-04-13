import { useState } from 'react';
import WalletCard from './components/WalletCard';
import RentProgressCard from './components/RentProgressCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';

export default function TenantDashboard() {
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
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left/Top Column (Wider) */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          <WalletCard 
            balance={wallet.balance} 
            onDeposit={() => setIsWalletOpen(true)}
            onWithdraw={() => setIsWalletOpen(true)}
            onTransfer={() => setIsWalletOpen(true)}
          />

          <RentProgressCard 
            amountPaid={activeRent.amountPaid}
            totalRent={activeRent.totalRent}
            daysLeft={activeRent.daysLeft}
            remainingAmount={activeRent.remainingAmount}
            currentMonth={activeRent.currentMonth}
          />
        </div>

        {/* Right/Bottom Column */}
        <div className="flex flex-col">
          <RecentActivitiesCard />
        </div>

      </div>

      {/* Action Sheets */}
      <FullScreenWalletSheet 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
        balance={wallet.balance}
      />
    </div>
  );
}
