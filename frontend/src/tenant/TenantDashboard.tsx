import { useState, useEffect } from 'react';
import WalletCard from './components/WalletCard';
import RentProgressCard from './components/RentProgressCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import { getTenantRentProgress, getTenantWallet } from '../services/tenantApi';

export default function TenantDashboard() {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [activeRent, setActiveRent] = useState({
    amountPaid: 0,
    totalRent: 0,
    daysLeft: 0,
    remainingAmount: 0,
    currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });

  // --- STATE LAYER ---
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    getTenantWallet()
      .then(res => setWallet({ balance: res.wallet?.balance || 0 }))
      .catch(console.error);

    getTenantRentProgress()
      .then(setActiveRent)
      .catch(console.error);
  }, []);

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
