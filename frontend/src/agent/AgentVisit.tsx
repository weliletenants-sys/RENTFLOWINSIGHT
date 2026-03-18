import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Navigation, Phone, User, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock Data
const MOCK_TENANTS = [
  {
    id: 't-101',
    name: 'Samuel Ochieng',
    phone: '+256 700 123 456',
    location: 'Ntinda Complex, Apt 4B',
    distance: '0.2 km',
    rentStatus: 'overdue',
    outstandingBalance: 150000,
    dailyAmount: 15000,
    lastPaymentDate: '2023-10-20',
  },
  {
    id: 't-102',
    name: 'Grace Nakato',
    phone: '+256 772 987 654',
    location: 'Bukoto Heights, Unit 12',
    distance: '1.5 km',
    rentStatus: 'partial',
    outstandingBalance: 50000,
    dailyAmount: 20000,
    lastPaymentDate: '2023-10-24',
  },
  {
    id: 't-103',
    name: 'David Musisi',
    phone: '+256 755 333 222',
    location: 'Kololo Ridge, Villa 3',
    distance: '3.1 km',
    rentStatus: 'paid',
    outstandingBalance: 0,
    dailyAmount: 30000,
    lastPaymentDate: '2023-10-24',
  },
  {
    id: 't-104',
    name: 'Sarah Kintu',
    phone: '+256 788 111 999',
    location: 'Naguru Hills, Plot 45',
    distance: '0.8 km',
    rentStatus: 'overdue',
    outstandingBalance: 300000,
    dailyAmount: 25000,
    lastPaymentDate: '2023-10-15',
  }
];

export default function AgentVisit() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'assigned' | 'nearby'>('assigned');

  // Filter tenants based on search and tab
  const filteredTenants = MOCK_TENANTS.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In a real app, 'nearby' would filter by actual GPS distance logic.
    // Here we just mock it by sorting or filtering distance strings.
    const matchesTab = activeTab === 'nearby' ? parseFloat(tenant.distance) < 2.0 : true;

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'partial': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <CheckCircle2 size={14} className="mr-1" />;
      case 'partial': return <Clock size={14} className="mr-1" />;
      case 'overdue': return <AlertCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 min-h-screen font-['Public_Sans'] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Field Visits</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select a tenant to visit</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search name, phone, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm focus:ring-2 focus:ring-[#6d28d9] outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'assigned' ? 'bg-white dark:bg-slate-700 text-[#6d28d9] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            My Assigned (4)
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'nearby' ? 'bg-white dark:bg-slate-700 text-[#6d28d9] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <MapPin size={16} />
            Nearby
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredTenants.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                <Search size={28} />
              </div>
              <p className="text-slate-500 font-medium">No tenants found.</p>
            </div>
          ) : (
            filteredTenants.map(tenant => (
              <div 
                key={tenant.id}
                onClick={() => navigate(`/agent-visit/${tenant.id}`)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-[#6d28d9]/50 transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center font-bold text-lg">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{tenant.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={12} /> {tenant.phone}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center ${getStatusColor(tenant.rentStatus)}`}>
                    {getStatusIcon(tenant.rentStatus)}
                    {tenant.rentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Balance</p>
                    <p className={`font-bold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                      UGX {tenant.outstandingBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Daily Rate</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      UGX {tenant.dailyAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center gap-1 truncate w-2/3">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{tenant.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-[#6d28d9] bg-[#6d28d9]/10 px-2 py-1 rounded-md">
                    <Navigation size={12} />
                    {tenant.distance}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
