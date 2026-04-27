import { Clock } from 'lucide-react';

export default function ApplicationStatus() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 sm:p-4 flex justify-center items-center relative overflow-hidden transition-colors duration-300">
      <div className="w-full min-h-screen bg-white dark:bg-slate-800 relative flex flex-col shadow-2xl overflow-hidden z-10 transition-colors duration-300">

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
          
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-100 dark:bg-yellow-500/20 rounded-full blur-2xl opacity-60 transition-colors"></div>
            <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-200 dark:border-yellow-500/30 shadow-xl shadow-yellow-500/20 dark:shadow-none relative z-10 mx-auto transition-colors">
              <Clock className="text-yellow-600 dark:text-yellow-500 transition-colors" size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">Application Received</h1>
          <div className="inline-block bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 border border-yellow-200 dark:border-yellow-500/30 transition-colors">
            Pending Approval
          </div>

          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-[280px] mb-8 transition-colors">
            Your application is pending approval. Our verification team is reviewing your information and will contact you shortly if we need anything else.
          </p>

          <div className="mt-auto w-full text-center">
             <p className="text-sm text-gray-400 dark:text-slate-500 font-medium transition-colors">Please wait for notification before proceeding.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
