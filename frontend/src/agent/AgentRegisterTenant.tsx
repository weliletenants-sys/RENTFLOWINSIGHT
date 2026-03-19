import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  User,
  MapPin,
  ArrowRight,
  Info,
  Zap,
} from 'lucide-react';
import PurpleBubbles from '../components/PurpleBubbles';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AgentRegisterTenant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    phoneNumber: '',
    occupation: '',
    workAddress: '',
    homeAddress: '',
    village: '',
    subcounty: '',
    parish: '',
    district: '',
    // Step 2
    monthlyRent: '',
    depositAmount: '',
    rentDueDate: '',
    // Step 3
    paybackOption: 'monthly',
    paybackDuration: '',
    // Step 4
    landlordName: '',
    landlordPhone: '',
    landlordEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await axios.post('/api/agent/users/tenant', {
          name: formData.fullName,
          phone: formData.phoneNumber,
          district: formData.district,
          reference: 'Agent Registration'
        });
        toast.success('Tenant onboarded successfully!');
        navigate(-1);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to register tenant.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative bg-white dark:bg-[#221610] font-['Public_Sans'] text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors duration-300 flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PurpleBubbles />
      </div>
      
      {/* Sticky Header Component */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Register Tenant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Step {step} of 4</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className="size-8 rounded-full bg-[#6d28d9]/10 flex items-center justify-center text-[#6d28d9]">
                <ShieldCheck size={16} />
              </div>
              <span className="text-sm font-semibold text-[#6d28d9]">Welile Fintech</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
            {/* Active Progress Line */}
            <div
              className="absolute top-5 left-0 h-0.5 bg-[#6d28d9] -z-10 transition-all duration-300"
              style={{ width: `${(step - 1) * 33.3}%` }}
            ></div>
            
            {/* Steps map */}
            {[
              { num: 1, label: 'Tenant Details' },
              { num: 2, label: 'Rent Details' },
              { num: 3, label: 'Payback Details' },
              { num: 4, label: 'Landlord Details' },
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isActive || isPast
                        ? 'bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/30'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-xs ${isActive ? 'font-bold text-[#6d28d9]' : 'font-medium text-slate-400 dark:text-slate-500'} ${
                      s.num !== 1 ? 'hidden sm:block' : ''
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-10 relative overflow-hidden"
        >
          <form onSubmit={handleNext} className="space-y-10">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6d28d9]/10 rounded-lg text-[#6d28d9]">
                      <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="e.g. John Doe" type="text" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="+256 700 000 000" type="tel" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Occupation</label>
                      <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="e.g. Software Engineer" type="text" required />
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100 dark:border-slate-800 my-10" />

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6d28d9]/10 rounded-lg text-[#6d28d9]">
                      <MapPin size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Location Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Address</label>
                      <input name="workAddress" value={formData.workAddress} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="Business Park, Plot 12" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Home Address</label>
                      <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="Residential Area, House 4" type="text" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Village / Cell</label>
                      <input name="village" value={formData.village} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="Enter Village" type="text" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subcounty</label>
                      <input name="subcounty" value={formData.subcounty} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="Enter Subcounty" type="text" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Parish / Ward</label>
                      <input name="parish" value={formData.parish} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="Enter Parish" type="text" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">District</label>
                      <select name="district" value={formData.district} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" required>
                        <option disabled value="">Select District</option>
                        <option value="kampala">Kampala</option>
                        <option value="wakiso">Wakiso</option>
                        <option value="mbarara">Mbarara</option>
                        <option value="jinja">Jinja</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 2: Rent Details */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6d28d9]/10 rounded-lg text-[#6d28d9]">
                      <Info size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Rent Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Rent Amount (UGX)</label>
                      <input name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="0" type="number" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Downpayment / Security Deposit</label>
                      <input name="depositAmount" value={formData.depositAmount} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="0" type="number" required />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rent Due Date (Day of Month)</label>
                      <input name="rentDueDate" value={formData.rentDueDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="e.g. 5 for 5th of every month" type="number" min="1" max="31" required />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 3: Payback Details */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6d28d9]/10 rounded-lg text-[#6d28d9]">
                      <Zap size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Payback Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payback Option</label>
                      <select name="paybackOption" value={formData.paybackOption} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" required>
                        <option value="monthly">Monthly Instalments</option>
                        <option value="weekly">Weekly Instalments</option>
                        <option value="full">Full Upfront Payment</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (Months)</label>
                      <input name="paybackDuration" value={formData.paybackDuration} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="e.g. 6" type="number" required />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 4: Landlord Details */}
            {step === 4 && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6d28d9]/10 rounded-lg text-[#6d28d9]">
                      <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Landlord Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Landlord Name</label>
                      <input name="landlordName" value={formData.landlordName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="e.g. Jane Smith" type="text" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Landlord Phone</label>
                      <input name="landlordPhone" value={formData.landlordPhone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="+256 700 000 000" type="tel" required />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Landlord Email (Optional)</label>
                      <input name="landlordEmail" value={formData.landlordEmail} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6d28d9] focus:ring-2 focus:ring-[#6d28d9]/20 outline-none transition-all" placeholder="jane.smith@example.com" type="email" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800 mt-10 gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto text-slate-500 font-semibold hover:text-slate-700 dark:hover:text-slate-300 px-6 py-3 transition-colors text-center"
              >
                {step === 1 ? 'Cancel Registration' : 'Back to previous'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#6d28d9] hover:bg-[#6d28d9]/90 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-[#6d28d9]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {step === 4 ? (isSubmitting ? 'Submitting...' : 'Finish & Submit') : 'Next Step'}
                {step < 4 && <ArrowRight size={20} />}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Help Section */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
          <Info size={16} />
          <p className="text-xs">
            Your data is secured with bank-grade encryption. Need help?{' '}
            <a className="text-[#6d28d9] font-medium hover:underline" href="#">
              Contact Support
            </a>
          </p>
        </div>
      </main>

      {/* Footer Space */}
      <footer className="relative z-10 py-12 bg-slate-50 dark:bg-[#1a110c] mt-auto border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-[#6d28d9] rounded-md flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Welile Fintech Platform</p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2024 Welile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
