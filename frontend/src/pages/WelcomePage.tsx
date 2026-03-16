import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, ShieldCheck, Wallet, Wrench, Search, PenTool, CreditCard, Send } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { setIntendedRole } = useAuth();

  const handleJoin = () => {
    setIntendedRole('TENANT');
    navigate('/signup');
  };

  const handleLogin = () => {
    setIntendedRole('TENANT');
    navigate('/login');
  };

  return (
    <div className="bg-[#fbf8ff] dark:bg-[#120d1d] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#8b5cf6]/10 bg-[#fbf8ff]/80 backdrop-blur-md dark:bg-[#120d1d]/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6] text-white">
              <Star size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">RentFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold hover:text-[#8b5cf6] transition-colors" href="#">Features</a>
            <a className="text-sm font-semibold hover:text-[#8b5cf6] transition-colors" href="#">How it Works</a>
            <a className="text-sm font-semibold hover:text-[#8b5cf6] transition-colors" href="#">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={handleLogin} className="hidden sm:block text-sm font-bold hover:text-[#8b5cf6] transition-colors">Log In</button>
            <button onClick={handleJoin} className="rounded-lg bg-[#8b5cf6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#8b5cf6]/25 hover:bg-[#6d28d9] transition-all">
              Request for Rent
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-16 lg:px-20 lg:py-24">
          <div className="container mx-auto">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#8b5cf6]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8b5cf6]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8b5cf6] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8b5cf6]"></span>
                  </span>
                  Trusted by 50k+ Tenants
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white lg:text-7xl">
                    Rent and Manage <span className="text-[#8b5cf6]">with Ease</span>
                  </h1>
                  <p className="max-w-[540px] text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Join the modern platform for seamless property management and secure payments. Everything you need for your home in one sleek app.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={handleJoin} className="rounded-xl bg-[#8b5cf6] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#8b5cf6]/30 transition-all hover:-translate-y-1 hover:bg-[#6d28d9]">
                    Request for Rent
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#8b5cf6]/20 to-transparent blur-2xl"></div>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-2xl">
                  <img alt="Modern Apartment" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVko2x7JKiGozwAyeyZX5yGSzJDqzzI5L09cFIWrVgcdQH8VvbMSYKm0DPf6emvtbBfPzDDftTjdtfRSd8gCa_1kcfwKSqj78uAKDt92mWyIorsVyCkaW6t4qnj9JgbLNI1X6bknHUb4f-RgbMzaERv2cIzfGllITgsaxBb3ZyT9PqbjOK0IU0T4YxEHV0na8wZhawwWPkuEf_YBeDqWySujX_qtDQLY2hTHfPbK_i9lZOwhlqSkj8UDN9BsCBnNKJdUyBMNvPyDz2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white px-6 py-20 dark:bg-slate-950 lg:px-20">
          <div className="container mx-auto">
            <div className="mb-16 flex flex-col gap-4">
              <h2 className="text-3xl font-black tracking-tight lg:text-4xl">Why RentFlow?</h2>
              <div className="h-1 w-20 bg-[#8b5cf6] rounded-full"></div>
              <p className="max-w-[600px] text-slate-600 dark:text-slate-400">
                Experience the future of renting with our comprehensive suite of tools designed for the modern tenant.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group relative rounded-2xl border border-slate-100 bg-[#fbf8ff] p-8 transition-all hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Secure Payments</h3>
                <p className="text-slate-600 dark:text-slate-400">Rest easy knowing your transactions are protected by industry-leading encryption and fraud detection.</p>
              </div>
              <div className="group relative rounded-2xl border border-slate-100 bg-[#fbf8ff] p-8 transition-all hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white">
                  <Wallet size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Digital Wallet</h3>
                <p className="text-slate-600 dark:text-slate-400">Manage your funds, automate rent payments, and track your payment history in one centralized hub.</p>
              </div>
              <div className="group relative rounded-2xl border border-slate-100 bg-[#fbf8ff] p-8 transition-all hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white">
                  <Wrench size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Maintenance Support</h3>
                <p className="text-slate-600 dark:text-slate-400">Submit requests and track repairs directly through the platform with real-time status updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="px-6 py-24 lg:px-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black tracking-tight lg:text-4xl">How it Works</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Your journey to a new home simplified in three steps.</p>
            </div>
            <div className="relative grid gap-12 md:grid-cols-3">
              {/* Connecting Line */}
              <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-[#8b5cf6]/10 md:block"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg ring-8 ring-[#fbf8ff] dark:ring-[#120d1d]">
                  <Search size={32} />
                </div>
                <h4 className="mb-2 text-xl font-bold">Find Property</h4>
                <p className="text-slate-600 dark:text-slate-400">Browse curated listings that match your lifestyle and budget in your preferred locations.</p>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg ring-8 ring-[#fbf8ff] dark:ring-[#120d1d]">
                  <PenTool size={32} />
                </div>
                <h4 className="mb-2 text-xl font-bold">Sign Agreement</h4>
                <p className="text-slate-600 dark:text-slate-400">Review and sign your digital lease securely from any device with our legal-grade e-signatures.</p>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg ring-8 ring-[#fbf8ff] dark:ring-[#120d1d]">
                  <CreditCard size={32} />
                </div>
                <h4 className="mb-2 text-xl font-bold">Pay Rent</h4>
                <p className="text-slate-600 dark:text-slate-400">Set up automated payments and never worry about late fees again with our secure payment system.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 lg:px-20">
          <div className="container mx-auto">
            <div className="rounded-3xl bg-[#8b5cf6] p-12 text-center text-white lg:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black lg:text-5xl">Ready to move in?</h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                  Join thousands of satisfied tenants who have simplified their lives with RentFlow. Sign up today and find your dream home.
                </p>
                <button 
                  onClick={handleJoin} 
                  className="mt-10 rounded-xl bg-white px-10 py-4 text-lg font-black text-[#8b5cf6] transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
                >
                  Request for Rent
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-6 py-12 dark:border-slate-800 dark:bg-slate-950 lg:px-20">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#8b5cf6] text-white">
                  <Star size={20} />
                </div>
                <span className="text-xl font-extrabold tracking-tight">RentFlow</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The all-in-one platform for the modern tenant. Manage leases, pay rent, and request maintenance from your pocket.
              </p>
            </div>
            <div>
              <h5 className="mb-4 font-bold">Product</h5>
              <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a className="hover:text-[#8b5cf6]" href="#">Features</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Mobile App</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Security</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-bold">Company</h5>
              <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a className="hover:text-[#8b5cf6]" href="#">About Us</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Careers</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Blog</a></li>
                <li><a className="hover:text-[#8b5cf6]" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-bold">Newsletter</h5>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Get the latest rental tips and market insights.</p>
              <div className="flex gap-2">
                <input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-[#8b5cf6] focus:ring-[#8b5cf6] dark:border-slate-700 dark:bg-slate-900" placeholder="Email" type="email" />
                <button className="rounded-lg bg-[#8b5cf6] px-4 py-2 text-white hover:bg-[#6d28d9]">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-slate-800 md:flex-row">
            <p className="text-xs text-slate-500">© 2024 RentFlow. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a className="hover:text-[#8b5cf6]" href="#">Privacy Policy</a>
              <a className="hover:text-[#8b5cf6]" href="#">Terms of Service</a>
              <a className="hover:text-[#8b5cf6]" href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
