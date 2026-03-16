import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FunderInvestModal from './FunderInvestModal';
import FunderWalletCard from './components/FunderWalletCard';
import FunderActionButtons from './components/FunderActionButtons';
import FunderPortfolioList from './components/FunderPortfolioList';

export default function FunderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ 
    walletBalance: 0, 
    principalInvested: 0, 
    expectedAmount: 0 
  });
  
  const [virtualHouses, setVirtualHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DEV: Fake Data load — auth check disabled for frontend development
  useEffect(() => {
    try {
      // Commented out for frontend dev — re-enable before production
      // if (user && user.isVerified === false) {
      //   navigate('/funder-onboarding');
      //   return;
      // }

      // Exact values matching the FUNDER.html template showcase
      setStats({
        walletBalance: 0,
        principalInvested: 45000000, // 45M
        expectedAmount: 4200000 // 4.2M
      });
      
      setVirtualHouses([
        { id: '1', name: 'Kampala Residential', type: 'residential', apy: 12.5, invested: 15000000, expectedReturn: 1800000, maturityDate: 'Oct 12, 2026' },
        { id: '2', name: 'Entebbe Commercial', type: 'commercial', apy: 15.2, invested: 20000000, expectedReturn: 3000000, maturityDate: 'Jan 15, 2027' },
        { id: '3', name: 'Jinja Industrial', type: 'industrial', apy: 18.0, invested: 10000000, expectedReturn: 1800000, maturityDate: 'May 20, 2026' },
      ]);
    } catch (error) {
      console.error('Failed to load funder data', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading portfolio...</div>;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <FunderWalletCard 
            balance={stats.walletBalance}
            principal={stats.principalInvested}
            expectedAmount={stats.expectedAmount}
          />

          <FunderActionButtons 
            onDeposit={() => setIsModalOpen(true)}
            onWithdraw={() => console.log('Withdraw requested')}
          />
        </div>

        <div className="lg:col-span-2">
          <FunderPortfolioList 
            portfolios={virtualHouses}
            onCashOut={(id) => console.log('Cashout requested for', id)}
            onAddAsset={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <FunderInvestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletBalance={20000000} // Mock balance
        onSuccess={(amount) => {
          setStats(prev => ({
            ...prev,
            principalInvested: prev.principalInvested + amount,
            expectedAmount: prev.expectedAmount + (amount * 0.15)
          }));
        }}
      />
    </div>
  );
}
