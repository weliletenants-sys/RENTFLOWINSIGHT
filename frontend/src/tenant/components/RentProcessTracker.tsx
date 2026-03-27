import { Check, Clock, AlertCircle } from 'lucide-react';

interface RentProcessTrackerProps {
  status: 'pending' | 'approved' | 'funded' | 'disbursed' | 'completed';
}

export default function RentProcessTracker({ status }: RentProcessTrackerProps) {
  
  const steps = [
    { id: 'pending', label: 'Pending', desc: 'Application received' },
    { id: 'approved', label: 'Approved', desc: 'Manager verification' },
    { id: 'funded', label: 'Funded', desc: 'Pool supporter matched' },
    { id: 'disbursed', label: 'Disbursed', desc: 'Transferred to landlord' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === status);
  };

  const currentIndex = getCurrentStepIndex();

  if (status === 'completed' || currentIndex === -1) {
    return null; // Hide tracker if completed or missing
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 transition-colors">Process Tracker</h3>
      
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-slate-700 rounded-full transition-colors"></div>

        <div className="space-y-6 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.id} className="flex gap-4 items-start">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white' : 
                    isCurrent ? 'bg-purple-100 dark:bg-purple-500/20 border-[#512DA8] dark:border-purple-400 text-[#512DA8] dark:text-purple-400' :
                    'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-300 dark:text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : 
                   isCurrent ? <Clock size={16} strokeWidth={2.5} /> :
                   <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-slate-600 transition-colors"></span>}
                </div>
                
                <div className={`mt-1 transition-opacity ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40'}`}>
                  <h4 className={`text-sm font-bold transition-colors ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>{step.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'pending' && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3 rounded-xl flex gap-3 text-blue-800 dark:text-blue-400 transition-colors">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">Your application is currently being reviewed by a manager. This usually takes 1-2 hours.</p>
        </div>
      )}
    </div>
  );
}
