import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Briefcase } from 'lucide-react';

export default function AgentWelcome() {
  const navigate = useNavigate();
  // We keep intendedRole in context if needed, but not strictly used here
  const { } = useAuth();
  
  const [earningsCount, setEarningsCount] = useState(0);
  const targetEarnings = 35600000;

  // Animated counter effect
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setEarningsCount(Math.floor(easeProgress * targetEarnings));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="w-full max-w-md bg-white sm:rounded-[2rem] sm:shadow-xl sm:border border-gray-100 min-h-screen sm:min-h-0 relative flex flex-col">
        
        {/* Decorative Top */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-[#4A3AFF] to-[#2B1B99] sm:rounded-t-[2rem]">
          <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="pt-32 px-6 pb-6 relative flex flex-col flex-1 z-10">
          
          <div className="bg-white mx-auto w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mb-6 border border-[#EBEAED]">
            <Briefcase className="w-8 h-8 text-[#4A3AFF]" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">
              Welile Agents Network
            </h1>
            <p className="text-[#6B7280] text-sm">
              Earn by connecting businesses and people to Welile services.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#4A3AFF]/5 to-[#4A3AFF]/10 p-6 rounded-2xl border border-[#4A3AFF]/20 mb-auto relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#4A3AFF]/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h2 className="text-sm font-medium text-[#4A3AFF] mb-1">Total Agent Earnings Today</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900">UGX</span>
              <span className="text-4xl font-extrabold text-gray-900 tabular-nums tracking-tight">
                {earningsCount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total commissions paid to agents today
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate('/agent-signup')}
              className="w-full bg-[#4A3AFF] text-white py-4 rounded-xl font-medium shadow-lg shadow-[#4A3AFF]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Become an Agent
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white text-gray-700 py-4 rounded-xl font-medium border border-gray-200 transition-all active:bg-gray-50"
            >
              Log In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
