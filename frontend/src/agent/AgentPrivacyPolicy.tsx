import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgentPrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen text-slate-900 dark:text-slate-100 font-['Public_Sans'] pb-10">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-sm border-x border-slate-100 dark:border-slate-800">
        
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Privacy Policy</h1>
          <div className="w-9" />
        </header>

        <div className="p-6">
          <div className="flex flex-col items-center justify-center p-6 bg-[#6d28d9]/5 border border-[#6d28d9]/10 rounded-2xl mb-8">
            <div className="size-16 bg-[#6d28d9]/10 text-[#6d28d9] rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-center">Your Privacy Matters</h2>
            <p className="text-sm text-center text-slate-500 mt-2">
              We use bank-grade encryption to ensure your data is secure.
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Data Collection</h3>
            <p className="mb-6 leading-relaxed">
              We collect information to provide better services to all our users. Information we collect includes your basic profile details, transactions log, and tenant records.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. How We Use It</h3>
            <p className="mb-6 leading-relaxed">
              We use the collected data to maintain, protect, and improve our services, develop new features, and protect Welile Fintech and our users.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Data Sharing</h3>
            <p className="mb-6 leading-relaxed">
              We do not share your personal information with companies, organizations, or individuals outside of Welile Fintech except in certain restricted circumstances, such as with your consent or for legal reasons.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Security Procedures</h3>
            <p className="mb-6 leading-relaxed">
              We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use SSL encryption for all data transport.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
