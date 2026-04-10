import { useNavigate } from 'react-router-dom';
import { cooSidebarConfig } from '../../components/layout/executiveSidebarConfig';

export default function QuickNavigationGrid() {
  const navigate = useNavigate();
  
  // Aggregate all items from the config, excluding 'Overview' to save space on the Home Page itself.
  const allNavItems = cooSidebarConfig.flatMap(section => section.items).filter(item => item.path !== '/coo/overview');

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Fast-Travel Grid</h2>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Jump straight to operational terminals</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {allNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="group flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-[var(--color-primary-faint)] hover:border-[var(--color-primary-border)] hover:shadow-[0_8px_20px_var(--color-primary-shadow)] transition-all duration-300 active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[var(--color-primary-border)] flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
              <item.icon size={18} className="text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center leading-tight group-hover:text-[var(--color-primary-dark)] transition-colors">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
