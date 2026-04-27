import { Briefcase, CalendarClock, CalendarDays } from 'lucide-react';

interface IncomeTypeSelectorProps {
  selected: 'daily' | 'weekly' | 'monthly';
  onSelect: (type: 'daily' | 'weekly' | 'monthly') => void;
}

export default function IncomeTypeSelector({ selected, onSelect }: IncomeTypeSelectorProps) {
  const options = [
    { id: 'daily', label: 'Daily Earner', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'weekly', label: 'Weekly Earner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'monthly', label: 'Monthly Salary', icon: <CalendarClock className="w-4 h-4" /> }
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500">Income Frequency</label>
      <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
        {options.map(opt => {
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={(e) => { e.preventDefault(); onSelect(opt.id); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)] scale-100 font-bold border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 font-semibold scale-95 transparent'
              }`}
            >
              {opt.icon}
              <span className="text-xs">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
