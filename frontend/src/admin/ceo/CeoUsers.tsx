import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, UserPlus, ShieldCheck, Activity, Download } from 'lucide-react';

export default function CeoUsers() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/v1/executive/ceo/user-acquisition');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load user acquisition matrix', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-sm rounded-xl">
          <p className="font-outfit font-bold text-slate-800">{payload[0].name}</p>
          <p className="text-sm font-medium text-slate-600">{payload[0].value.toLocaleString()} Users</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Global Network</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">User Matrix & Acquisition</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm">
            <Download size={16} />
            Export Demographics
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users size={32} />
           </div>
           <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Lifetime Registered</p>
              <h3 className="text-3xl font-bold text-slate-900 font-outfit">
                {data ? data.totalUsers.toLocaleString() : '...'}
              </h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Activity size={32} />
           </div>
           <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Accounts (30 Days)</p>
              <h3 className="text-3xl font-bold text-slate-900 font-outfit">
                {data ? data.activeUsers.toLocaleString() : '...'}
              </h3>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 w-full flex items-center justify-center bg-white rounded-2xl border border-slate-100">
           <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Visualization */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 font-outfit mb-6">Acquisition Funnel</h3>
            <div className="flex flex-col gap-4">
               {data?.funnel.map((step: any, idx: number) => {
                 // Calculate percentage relative to total signups (stage 0)
                 const maxCount = data.funnel[0].count;
                 const percentage = Math.round((step.count / maxCount) * 100);
                 
                 const icons = [<UserPlus key="1"/>, <ShieldCheck key="2"/>, <Activity key="3"/>];
                 const colors = ['bg-indigo-50 text-indigo-600 border-indigo-100', 'bg-purple-50 text-purple-600 border-purple-100', 'bg-emerald-50 text-emerald-600 border-emerald-100'];
                 const barColors = ['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'];
                 
                 return (
                   <div key={idx} className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border ${colors[idx]}`}>
                         {icons[idx]}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-800">{step.stage}</span>
                            <span className="text-sm font-bold text-slate-600">{step.count.toLocaleString()}</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div className={`h-full ${barColors[idx]} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                         </div>
                         <div className="text-xs font-medium text-slate-400 mt-1">{percentage}% Conversion Rate</div>
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>

          {/* Demographics Pie */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 font-outfit mb-2">Platform Demographics</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.demographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data?.demographics.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
