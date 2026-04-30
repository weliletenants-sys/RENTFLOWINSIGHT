import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { TrendingDown, Target, Zap, Clock, AlertTriangle } from 'lucide-react';

interface RunwayAnalyticsTabProps {
  runwayData?: any;
}

const CompactCurrency = ({ value }: { value: number }) => {
  if (value >= 1000000) return <span>UGX {(value / 1000000).toFixed(1)}M</span>;
  if (value >= 1000) return <span>UGX {(value / 1000).toFixed(1)}K</span>;
  return <span>UGX {value.toLocaleString()}</span>;
};

export default function RunwayAnalyticsTab({ runwayData }: RunwayAnalyticsTabProps) {
  // Use provided data or fallback to safe mock
  const data = runwayData || {
    runwayMonths: 14.5,
    monthlyBurnRate: 15200000,
    projectedCashZeroDate: 'Oct 2027',
    currentCashBal: 220000000,
    projection: [
      { month: 'Apr', cash: 220000000, inflows: 8500000, outflows: 23700000 },
      { month: 'May', cash: 204800000, inflows: 9200000, outflows: 23700000 },
      { month: 'Jun', cash: 190300000, inflows: 9800000, outflows: 23700000 },
      { month: 'Jul', cash: 176400000, inflows: 10500000, outflows: 24200000 },
      { month: 'Aug', cash: 162700000, inflows: 10800000, outflows: 24200000 },
      { month: 'Sep', cash: 149300000, inflows: 11500000, outflows: 24200000 },
    ]
  };

  const isCritical = data.runwayMonths < 6;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-2xl font-inter">
          <p className="font-bold text-slate-800 mb-2">{label} Projection</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center gap-6 text-sm mb-1">
              <span className="flex items-center gap-2 font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                {p.name}
              </span>
              <span className="font-bold text-slate-900">
                 {p.value.toLocaleString()} UGX
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Alert Banner for Critical Runway */}
      {isCritical && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-200 shadow-sm animate-pulse">
          <AlertTriangle size={24} />
          <div>
            <h4 className="font-bold text-sm">Critical Cash Path Detected</h4>
            <p className="text-xs opacity-90">Projected runway has fallen below the 6-month safety buffer. Immediate capital injection or burn rate reduction is required.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><Clock size={16} className="text-[#6c11d4]" /> Operational Runway</p>
          <div className="flex items-end gap-2">
            <h3 className={`text-4xl font-black font-outfit ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>{data.runwayMonths}</h3>
            <span className="text-slate-400 font-medium mb-1">months left</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><TrendingDown size={16} className="text-orange-500" /> Net Monthly Burn</p>
          <h3 className="text-3xl font-black font-outfit text-orange-600">
            <CompactCurrency value={data.monthlyBurnRate} />
          </h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><Zap size={16} className="text-emerald-500" /> Current Cash Balance</p>
          <h3 className="text-3xl font-black font-outfit text-emerald-600">
            <CompactCurrency value={data.currentCashBal} />
          </h3>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
          <p className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-2 relative z-10"><Target size={16} className="text-blue-400" /> Cash-Zero Projection</p>
          <h3 className="text-3xl font-black font-outfit relative z-10">{data.projectedCashZeroDate}</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Depletion Curve */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-font-bold text-slate-800 text-lg font-outfit">Projected Cash Depletion</h3>
            <p className="text-sm text-slate-500">Extrapolated 6-month capital runway</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.projection} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c11d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6c11d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `${value / 1000000}M`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cash" name="Total Cash" stroke="#6c11d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inflows vs Outflows */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-font-bold text-slate-800 text-lg font-outfit">Operating Income vs Burn</h3>
            <p className="text-sm text-slate-500">Projected gap analysis (inflows vs outflows)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.projection} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `${value / 1000000}M`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="inflows" name="Est. Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="outflows" name="Est. Outflows" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
