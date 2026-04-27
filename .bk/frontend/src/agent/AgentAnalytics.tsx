import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, Target, Award, Activity, Zap, Trophy, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/v1/agent/statistics/dashboard');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load performance metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Performance calculations purely mapped for visual rendering
  const scoreMetrics = [
    { metric: 'Earnings', value: 85, fullMark: 100 },
    { metric: 'Collections', value: 92, fullMark: 100 },
    { metric: 'Referrals', value: 60, fullMark: 100 },
    { metric: 'Visits', value: Math.min((data?.visits_today || 12) / 20 * 100, 100), fullMark: 100 }
  ];

  const totalScore = Math.floor(
    (scoreMetrics[0].value * 0.3) + 
    (scoreMetrics[1].value * 0.25) + 
    (scoreMetrics[2].value * 0.25) + 
    (scoreMetrics[3].value * 0.2)
  );

  const getTierDetails = (score: number) => {
    if (score >= 85) return { name: 'Gold Tier', color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-500', icon: <Trophy /> };
    if (score >= 60) return { name: 'Silver Tier', color: 'from-slate-300 to-slate-400', text: 'text-slate-500', icon: <Target /> };
    return { name: 'Bronze Tier', color: 'from-orange-700 to-orange-900', text: 'text-orange-700', icon: <Award /> };
  };

  const currentTier = getTierDetails(totalScore);

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-24 top-0 left-0 fixed w-full z-50 overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
               <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold font-outfit text-slate-900 dark:text-white leading-none mb-1">Performance</h1>
                <p className="text-xs font-medium text-slate-500">Tier Tracking & Analytics</p>
            </div>
          </div>
          <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 ${currentTier.text}`}>
             {currentTier.icon}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        
        {/* Tier Status Hero */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           <div className={`h-2 w-full bg-gradient-to-r ${currentTier.color}`}></div>
           <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Current Placement</p>
              <div className="flex items-baseline gap-2 mb-4">
                 <h2 className="text-4xl font-black font-outfit text-slate-900 dark:text-white">{currentTier.name}</h2>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Global Score</span>
                    <span className="text-slate-900 dark:text-white">{totalScore} Points</span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-full rounded-full bg-gradient-to-r ${currentTier.color}`} style={{ width: `${totalScore}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Streak Multiplier Card */}
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex justify-between items-center group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={100} />
           </div>
           <div className="relative z-10 w-full">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-xl font-bold font-outfit mb-1">Collection Streak</h3>
                    <p className="text-sm font-medium text-indigo-200">Consecutive Operational Days</p>
                 </div>
                 <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-sm font-bold flex items-center gap-1"><TrendingUp size={14}/> +1.2x Multiplier</span>
                 </div>
              </div>
              
              <div className="flex justify-between items-end mt-6">
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Current Chain</span>
                    <span className="text-4xl font-black tracking-tighter">14 Days</span>
                 </div>
                 <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Base Commission</span>
                    <span className="text-xl font-bold">5.0%</span>
                 </div>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="h-64 w-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
             <div className="w-8 h-8 border-4 border-[#6c11d4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-2 mb-6 text-[#6c11d4]">
                <Activity size={20} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Weighted Matrices</h3>
             </div>
             
             <div className="h-[300px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scoreMetrics}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Agent" dataKey="value" stroke="#6c11d4" strokeWidth={2} fill="#6c11d4" fillOpacity={0.4} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${value}% Target`, 'Validation']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
