import React from 'react';
import { useCeoUserAcquisition } from '../hooks/useExecutiveQueries';
import { Loader2, Users, UsersRound, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const formatCompact = (val: number): string => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function CeoUsersPage() {
  const { data, isLoading } = useCeoUserAcquisition();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={32} />
        <p className="font-medium">Aggregating demographic mapping...</p>
      </div>
    );
  }

  const funnel = data?.funnel || [];
  const demographics = data?.demographics || [];

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Users & Coverage</h1>
        <p className="text-slate-500 mt-1 text-[15px]">Acquisition funnel tracking and platform demographic spread.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Registered Profiles</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatCompact(data?.totalUsers || 0)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <UsersRound size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Fully Activated Users</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatCompact(data?.activeUsers || 0)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Activation Rate</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {data?.totalUsers ? Math.round((data.activeUsers / data.totalUsers) * 100) : 0}%
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Activation Funnel Drop-off</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={40}>
                  {funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Platform Demographics</h3>
          <p className="text-sm text-slate-500 mb-6">Distribution of roles currently occupying the userbase.</p>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [new Intl.NumberFormat().format(value || 0), 'Users']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
