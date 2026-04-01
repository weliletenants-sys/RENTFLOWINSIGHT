import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Download, Clock, MapPin, CheckCircle, Circle, AlertCircle, Phone, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Agent Daily Schedule
type TaskStatus = 'Pending' | 'Completed' | 'Overdue';
type TaskType   = 'Collection' | 'Inspection' | 'Eviction' | 'Key Handover';

interface ScheduleTask {
  id: string;
  time: string;
  type: TaskType;
  tenant: string;
  location: string;
  targetValue?: number;
  status: TaskStatus;
}

const mockSchedule: ScheduleTask[] = [
  { id: 'TSK_01', time: '08:00 AM', type: 'Inspection', tenant: 'Kyanja Annex (Unit 4)', location: 'Kyanja Road', status: 'Completed' },
  { id: 'TSK_02', time: '10:30 AM', type: 'Collection', tenant: 'Michael Kasule', location: 'Ntinda Complex', targetValue: 850000, status: 'Completed' },
  { id: 'TSK_03', time: '01:00 PM', type: 'Key Handover', tenant: 'Sarah Namagembe', location: 'Kololo Heights', status: 'Pending' },
  { id: 'TSK_04', time: '03:15 PM', type: 'Collection', tenant: 'David Ochieng', location: 'Muyenga Executive', targetValue: 1200000, status: 'Pending' },
  { id: 'TSK_05', time: '05:00 PM', type: 'Eviction', tenant: 'Peter Lwanga', location: 'Najjera Block B', status: 'Pending' },
];

export default function AgentSchedules() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  // Derive Daily Stats
  const dailyStats = useMemo(() => {
    let pendingValue = 0;
    let completedCount = 0;
    
    mockSchedule.forEach(task => {
       if (task.status === 'Completed') completedCount++;
       if (task.status === 'Pending' && task.targetValue) pendingValue += task.targetValue;
    });

    return { 
      total: mockSchedule.length, 
      completed: completedCount, 
      pendingValue 
    };
  }, []);

  const handlePdfExport = () => {
    setIsExporting(true);
    // Simulate PDF Build latency
    setTimeout(() => {
       setIsExporting(false);
       alert("Daily Itinerary PDF Generated & Saved to Device.");
    }, 1500);
  };

  const getStatusColor = (status: TaskStatus) => {
    if (status === 'Completed') return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (status === 'Overdue') return 'text-purple-500 bg-purple-50 border-purple-200';
    return 'text-amber-500 bg-amber-50 border-amber-200';
  };

  const getTypeIcon = (type: TaskType) => {
    if (type === 'Collection') return <Clock size={16} />;
    if (type === 'Inspection') return <FileText size={16} />;
    if (type === 'Eviction') return <AlertCircle size={16} />;
    return <Calendar size={16} />;
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Ambient BG */}
      <div className="fixed top-[-5%] right-[-5%] w-[40rem] h-[40rem] bg-[#9234eb]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Itinerary Planner</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Today's Schedule</p>
             </div>
          </div>
          
          <button 
             onClick={handlePdfExport}
             disabled={isExporting}
             className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all sm:w-auto w-full border ${isExporting ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-[#9234eb] text-white border-[#9234eb]/80 shadow-[#9234eb]/30 hover:bg-[#7b2cbf]'}`}
          >
             {isExporting ? (
                <>
                   <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                   Generating PDF...
                </>
             ) : (
                <>
                   <Download size={16} /> Export Route PDF
                </>
             )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* Daily Summary Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white"
           >
              {/* Date Block */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/20">
                 <div>
                    <h2 className="text-2xl font-black leading-tight">Tuesday Route</h2>
                    <p className="text-[12px] font-bold tracking-widest uppercase text-purple-200 mt-1">October 15, 2024</p>
                 </div>
                 <div className="bg-white/20 text-white p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <Calendar size={28} />
                 </div>
              </div>

              {/* Targets */}
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <p className="text-[10px] font-black tracking-widest text-purple-200 uppercase mb-2">Pending Cash Target</p>
                    <p className="text-3xl sm:text-4xl font-black text-white leading-none">
                       UGX {(dailyStats.pendingValue / 1000000).toFixed(2)}<span className="text-xl text-white/60 ml-1">M</span>
                    </p>
                 </div>
                 <div className="pl-6 border-l border-white/20">
                    <p className="text-[10px] font-black tracking-widest text-purple-200 uppercase mb-2">Tasks Completed</p>
                    <p className="text-3xl sm:text-4xl font-black text-white leading-none">
                       {dailyStats.completed} <span className="text-xl text-white/60">/ {dailyStats.total}</span>
                    </p>
                 </div>
              </div>
           </motion.div>

           {/* Export Action Card */}
           <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-100 flex flex-col justify-center items-center text-center gap-4"
           >
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-[#9234eb] shadow-inner">
                 <FileText size={32} />
              </div>
              <div>
                 <h3 className="font-black text-slate-800 text-lg">Route Manifest</h3>
                 <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[200px] mx-auto">Download your verified daily schedule for offline field access.</p>
              </div>
              <p className="text-[10px] font-black text-[#9234eb] uppercase tracking-widest bg-purple-50 px-3 py-1 mt-2 rounded-full border border-purple-100">
                 PDF Ready
              </p>
           </motion.div>
        </div>

        {/* The Timeline Track */}
        <div className="pt-4">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 px-2 mb-6">Field Assignments</h3>
           
           <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-10">
             {mockSchedule.map((task, index) => (
                <motion.div 
                   key={task.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                   className="relative"
                >
                   {/* Timeline Node */}
                   <div className={`absolute -left-[41px] bg-white rounded-full p-1 border-2 ${task.status === 'Completed' ? 'border-emerald-500 text-emerald-500' : 'border-slate-300 text-slate-300'}`}>
                      {task.status === 'Completed' ? <CheckCircle size={14} /> : <Circle size={14} />}
                   </div>

                   {/* Task Card */}
                   <div className={`bg-white rounded-[1.5rem] border p-6 transition-all duration-300 hover:shadow-lg ${task.status === 'Completed' ? 'border-emerald-100 shadow-[0_8px_30px_rgb(16,185,129,0.06)] opacity-80' : 'border-slate-200 shadow-sm'}`}>
                      
                      {/* Top Row: Time & Target */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                               {task.time}
                            </span>
                            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getStatusColor(task.status)}`}>
                               {getTypeIcon(task.type)} {task.type}
                            </span>
                         </div>
                         {task.targetValue && (
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase pb-1">Collection Target</p>
                               <p className="text-lg font-black text-[#9234eb] leading-none">UGX {task.targetValue.toLocaleString()}</p>
                            </div>
                         )}
                      </div>

                      {/* Middle Row: Content */}
                      <div>
                         <h3 className="text-xl font-bold text-slate-900 mb-1">{task.tenant}</h3>
                         <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                            <MapPin size={14} /> {task.location}
                         </div>
                      </div>

                      {/* Bottom Row: Actions */}
                      {task.status !== 'Completed' && (
                         <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                               <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all">Mark Done</button>
                               <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all">Reschedule</button>
                            </div>
                            <div className="flex gap-2">
                               <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200">
                                  <Phone size={16} />
                               </button>
                               <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-200">
                                  <Navigation size={16} />
                               </button>
                            </div>
                         </div>
                      )}

                   </div>
                </motion.div>
             ))}
           </div>
        </div>

      </main>
    </div>
  );
}
