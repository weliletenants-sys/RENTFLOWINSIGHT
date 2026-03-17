import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../contexts/AuthContext';
import PurpleBubbles from '../../components/PurpleBubbles';

export default function RoleSelection() {
  const { setIntendedRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: Role) => {
    // 1. Save the intended role selection
    if (role) {
      setIntendedRole(role);
    }
    if (role === 'AGENT') {
      navigate('/login');
    } else if (role === 'TENANT') {
      navigate('/signup');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
      <style>{`
        /* Animation delays for staggered cards */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

      `}</style>

      {/* Purple Bubbles Animated Background */}
      <PurpleBubbles />

      {/* BEGIN: Main Role Selection Container */}
      <main className="relative z-10 w-full max-w-6xl bg-white/60 backdrop-blur-xl border border-purple-200 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-16 opacity-0 animate-fade-in-up">
        {/* BEGIN: Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Path
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Select how you want to use Welile today.
          </p>
        </header>

        {/* BEGIN: Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Role Card: Tenant */}
          <button 
            onClick={() => handleSelectRole('TENANT')}
            className="group text-left bg-white p-8 rounded-2xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 opacity-0 animate-fade-in-up stagger-1"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-purple-100 rounded-xl text-[#6d28d9]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a11 11 0 002 2h10a2 2 0 002-2V10M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tenant</h2>
                <p className="text-gray-500 leading-relaxed">Get flexible rent support and housing access</p>
              </div>
            </div>
          </button>

          {/* Role Card: Agent */}
          <button 
            onClick={() => handleSelectRole('AGENT')}
            className="group text-left bg-white p-8 rounded-2xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 opacity-0 animate-fade-in-up stagger-2"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent</h2>
                <p className="text-gray-500 leading-relaxed">Earn commissions and grow your network</p>
              </div>
            </div>
          </button>

          {/* Role Card: Landlord */}
          <button 
            onClick={() => handleSelectRole('LANDLORD')}
            className="group text-left bg-white p-8 rounded-2xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 opacity-0 animate-fade-in-up stagger-3"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-orange-100 rounded-xl text-orange-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Landlord</h2>
                <p className="text-gray-500 leading-relaxed">List properties and manage tenants</p>
              </div>
            </div>
          </button>

          {/* Role Card: Supporter */}
          <button 
            onClick={() => handleSelectRole('FUNDER')}
            className="group text-left bg-white p-8 rounded-2xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 opacity-0 animate-fade-in-up stagger-4"
          >
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-green-100 rounded-xl text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Supporter</h2>
                <p className="text-gray-500 leading-relaxed">Fund rent and earn returns</p>
              </div>
            </div>
          </button>

        </div>

        {/* BEGIN: Footer */}
        <footer className="mt-16 text-center">
          <p className="text-gray-600 font-medium">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#6d28d9] font-bold hover:underline transition-all">
              Sign in
            </button>
          </p>
        </footer>

      </main>
    </div>
  );
}
