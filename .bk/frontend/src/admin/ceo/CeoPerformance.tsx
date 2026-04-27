import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Target, CheckCircle2, AlertTriangle, Clock, CalendarDays, Download } from 'lucide-react';

export default function CeoPerformance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get('/api/v1/executive/ceo/staff-performance');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load performance metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'breach': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'compliant': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'breach': return <Target size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-sm rounded-xl">
          <p className="font-outfit font-bold text-slate-800">{payload[0].payload.hour}</p>
          <p className="text-sm font-medium text-[var(--color-primary)]">{payload[0].value} Operations Processed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] font-inter">Global Operations</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900 font-outfit">SLA & Staff Performance</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm">
            <Download size={16} />
            Export Audit
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-96 w-full flex items-center justify-center bg-white rounded-2xl border border-slate-100">
           <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Activity Heatmap */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-outfit">Daily Operations Velocity</h3>
                <p className="text-sm text-slate-500 mt-1">Platform-wide transactional \& verification throughput by hour.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-600">
                <CalendarDays size={16} />
                <span>Today</span>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.activityHeatmap} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="volume" radius={[6, 6, 6, 6]} barSize={40}>
                    {data?.activityHeatmap.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.volume > 100 ? 'var(--color-primary)' : entry.volume > 50 ? '#818cf8' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 font-outfit mb-1">SLA Compliance</h3>
            <p className="text-sm text-slate-500 mb-6">Real-time target resolution adherence.</p>
            
            <div className="flex-1 flex flex-col gap-4">
               {data?.slaCompliance.map((sla: any, idx: number) => (
                 <div key={idx} className={`p-4 rounded-xl border ${getStatusColor(sla.status)} flex items-center gap-4 transition-all hover:scale-[1.02]`}>
                    <div className="bg-white/50 p-2.5 rounded-lg shadow-sm">
                       {getStatusIcon(sla.status)}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold font-outfit mb-0.5">{sla.metric}</h4>
                       <div className="flex justify-between items-center text-sm font-medium opacity-80">
                          <span>Target: {sla.target}</span>
                          <span>Avg: {sla.actual}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
               <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Staff Online</span>
                  <span className="font-outfit font-bold text-2xl">24 Active</span>
               </div>
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                     <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold ${i===4 ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>
                        {i === 4 ? '+20' : `OP`}
                     </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
