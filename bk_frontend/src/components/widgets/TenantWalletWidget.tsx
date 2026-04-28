import { useState, useEffect } from 'react';
import WalletCard from '../../tenant/components/WalletCard';
import FullScreenWalletSheet from '../../tenant/components/FullScreenWalletSheet';
import { getTenantWallet } from '../../services/tenantApi';

export default function TenantWalletWidget() {
  const [balance, setBalance] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    getTenantWallet()
      .then(res => setBalance(res.wallet?.balance || 0))
      .catch(console.error);
  }, []);

  return (
    <>
      <WalletCard 
        balance={balance} 
        onDeposit={() => setIsWalletOpen(true)}
        onWithdraw={() => setIsWalletOpen(true)}
        onTransfer={() => setIsWalletOpen(true)}
      />
      <FullScreenWalletSheet
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={balance}
      />
    </>
  );
}
