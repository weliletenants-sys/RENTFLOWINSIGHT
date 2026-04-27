import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, ArrowRight, ArrowLeft, Upload, File, Camera } from 'lucide-react';

export default function TenantOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState({
    occupation: '', workAddress: '', homeAddress: '',
    village: '', parish: '', subCounty: '', district: '',
    rentAmount: '', rentPeriod: '', rentPerMonth: '',
    landlordName: '', landlordPhone: '', landlordAddress: '', houseNumber: '',
    nextOfKinName: '', nextOfKinPhone: '', relationship: '',
    idFront: null as File | null, idBack: null as File | null, selfie: null as File | null,
    lc1Letter: null as File | null,
    consented: false
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const calculateFees = () => {
    const rent = parseFloat(formData.rentAmount) || 0;
    const durationMonths = parseFloat(formData.rentPeriod) || 1;
    const paybackPeriodDays = durationMonths * 30; // standard 30 days per month
    
    // Request Fee: 10k if <= 200k, else 20k
    const requestFee = rent > 200000 ? 20000 : 10000;
    
    // Access Fee (Interest): 33% monthly compounding
    // Formula: accessFee = rentAmount × ((1 + monthlyRate)^(durationDays / 30) − 1)
    const monthlyRate = 0.33;
    const accessFee = rent * (Math.pow(1 + monthlyRate, paybackPeriodDays / 30) - 1);
    
    const totalRepayment = rent + accessFee + requestFee;
    const dailyRepayment = Math.ceil(totalRepayment / paybackPeriodDays);
    
    return { 
      accessFee: Math.ceil(accessFee), 
      requestFee, 
      totalRepayment: Math.ceil(totalRepayment), 
      paybackPeriodDays, 
      dailyRepayment 
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consented) {
      alert("You must consent to complete the application.");
      return;
    }
    navigate('/application-status');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 sm:p-8 flex justify-center items-center relative transition-colors duration-300">
      <div className="w-full sm:max-w-3xl min-h-screen sm:min-h-0 sm:h-[85vh] bg-white dark:bg-slate-800 relative flex flex-col shadow-2xl dark:shadow-none sm:rounded-[2rem] overflow-hidden z-10 transition-colors duration-300">

        {/* Header */}
        <div className="pt-14 px-6 pb-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between shrink-0 transition-colors duration-300">
          <button onClick={step === 1 ? () => navigate('/tenant-agreement') : handleBack} className="w-10 h-10 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-900 dark:text-white z-20 transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 flex flex-col items-center relative px-4 sm:px-12">
            <h1 className="font-bold text-gray-900 dark:text-white mb-4 z-20 bg-white dark:bg-slate-800 px-4 transition-colors">Rent Financing</h1>
            
            {/* Visual Stepper */}
            <div className="flex items-center justify-between w-full max-w-[300px] relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-gray-100 dark:bg-slate-700 -z-10 transition-colors"></div>
              
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#512DA8] dark:bg-purple-500 -z-10 transition-all duration-300"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>

              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      s < step 
                        ? 'bg-[#10B981] dark:bg-emerald-500 text-white shadow-md ring-4 ring-white dark:ring-slate-800' 
                        : s === step 
                          ? 'bg-[#512DA8] dark:bg-purple-600 text-white shadow-md ring-4 ring-white dark:ring-slate-800' 
                          : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-2 border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    {s < step ? <Check size={16} strokeWidth={3} /> : s}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-10 z-20"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-2xl transition-colors">
                  <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-1 transition-colors">Personal Info (Auto-filled)</h3>
                  <p className="text-xs text-purple-700 dark:text-purple-400 transition-colors">Name: {user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 transition-colors">Phone: Verified (+256...)</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white transition-colors">Location & Work</h3>
                  <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="workAddress" placeholder="Work Address" value={formData.workAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="homeAddress" placeholder="Home Address" value={formData.homeAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <div className="flex gap-2">
                    <input type="text" name="subCounty" placeholder="Sub-County" value={formData.subCounty} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                    <input type="text" name="parish" placeholder="Parish" value={formData.parish} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  </div>
                  <input type="text" name="village" placeholder="Village / Cell" value={formData.village} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white transition-colors">Rent Details</h3>
                  <input type="number" name="rentAmount" placeholder="Amount Required (UGX)" value={formData.rentAmount} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="number" name="rentPeriod" placeholder="Rent Period (Months)" value={formData.rentPeriod} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="number" name="rentPerMonth" placeholder="Rent Per Month (UGX)" value={formData.rentPerMonth} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white transition-colors">Landlord Details</h3>
                  <input type="text" name="landlordName" placeholder="Landlord Full Name" value={formData.landlordName} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="tel" name="landlordPhone" placeholder="Landlord Phone" value={formData.landlordPhone} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="landlordAddress" placeholder="Landlord Address" value={formData.landlordAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="houseNumber" placeholder="House / Unit Number" value={formData.houseNumber} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-500/20 rounded-2xl p-5 shadow-sm transition-colors">
                  <h3 className="text-purple-900 dark:text-white font-black text-lg mb-4 text-center transition-colors">Payback Calculation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-slate-400 transition-colors">Rent Financed:</span>
                      <span className="font-bold text-gray-900 dark:text-white transition-colors">UGX {parseFloat(formData.rentAmount || '0').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-slate-400 transition-colors">Marketplace Access Fee (33%):</span>
                      <span className="font-bold text-gray-900 dark:text-white transition-colors">UGX {calculateFees().accessFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-slate-400 transition-colors">Processing Fee:</span>
                      <span className="font-bold text-gray-900 dark:text-white transition-colors">UGX {calculateFees().requestFee.toLocaleString()}</span>
                    </div>
                    <div className="h-px w-full bg-gray-100 dark:bg-slate-700 my-2 transition-colors"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 dark:text-white font-bold transition-colors">Total Amount to Repay:</span>
                      <span className="font-black text-[#512DA8] dark:text-purple-400 text-lg transition-colors">UGX {calculateFees().totalRepayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-4 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
                      <span className="text-gray-600 dark:text-slate-300 font-medium transition-colors">Daily Repayment:</span>
                      <span className="font-bold text-gray-900 dark:text-white transition-colors">UGX {calculateFees().dailyRepayment.toLocaleString()} / day</span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-2 transition-colors">Repayments start automatically the day after rent is paid.</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="font-bold text-gray-900 dark:text-white transition-colors">Next of Kin (Landlord Verification)</h3>
                  <input type="text" name="nextOfKinName" placeholder="Next of Kin Name" value={formData.nextOfKinName} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="tel" name="nextOfKinPhone" placeholder="Next of Kin Phone Number" value={formData.nextOfKinPhone} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                  <input type="text" name="relationship" placeholder="Relationship to Landlord" value={formData.relationship} onChange={handleChange} className="w-full bg-[#EFF4FA] dark:bg-slate-700/50 border border-[#DEE7F5] dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-[#512DA8] dark:focus:outline-purple-500 text-gray-900 dark:text-white dark:placeholder-slate-400 transition-colors" required />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">Identity Verification</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 transition-colors">Please upload clear photos of your National ID and a selfie.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase transition-colors">National ID (Front)</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idFront ? <div className="flex items-center gap-2 text-[#512DA8] dark:text-purple-400 font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 dark:text-slate-500 mb-2" size={24} /><p className="text-sm text-gray-500 dark:text-slate-400">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase transition-colors">National ID (Back)</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idBack ? <div className="flex items-center gap-2 text-[#512DA8] dark:text-purple-400 font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 dark:text-slate-500 mb-2" size={24} /><p className="text-sm text-gray-500 dark:text-slate-400">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase transition-colors">Selfie Photo</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.selfie ? <div className="flex items-center gap-2 text-[#512DA8] dark:text-purple-400 font-bold"><Check size={20}/> Uploaded</div> : <><Camera className="text-gray-400 dark:text-slate-500 mb-2" size={24} /><p className="text-sm text-gray-500 dark:text-slate-400">Take a selfie</p></>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">Local Verification</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 transition-colors">We need an introductory letter from your LC1 Chairperson.</p>
                  
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase transition-colors">LC1 Letter (PDF or Image)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition cursor-pointer relative overflow-hidden mb-8">
                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'lc1Letter')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {formData.lc1Letter ? <div className="flex items-center gap-2 text-[#512DA8] dark:text-purple-400 font-bold"><Check size={20}/> Uploaded</div> : <><File className="text-gray-400 dark:text-slate-500 mb-2" size={32} /><p className="text-sm text-gray-500 dark:text-slate-400">Upload LC1 Document</p></>}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 flex gap-3 mt-4 transition-colors">
                    <input 
                      type="checkbox" 
                      name="consented"
                      id="consent"
                      checked={formData.consented}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-[#512DA8] dark:text-purple-500 border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 focus:ring-[#512DA8] dark:focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[13px] text-gray-700 dark:text-slate-300 font-medium cursor-pointer leading-tight transition-colors">
                      I consent to Welile Technologies storing and processing my personal information for verification and rent financing purposes.
                    </label>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shrink-0 transition-colors duration-300">
          {step < totalSteps ? (
            <button 
              onClick={handleNext} 
              className="w-full bg-[#512DA8] dark:bg-[#6b45c2] text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-[#412387] dark:hover:bg-[#5a2e9d] cursor-pointer"
            >
              Next Step <ArrowRight size={20} strokeWidth={2} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={!formData.consented}
              className={`w-full py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition cursor-pointer ${formData.consented ? 'bg-[#10B981] dark:bg-emerald-600 hover:bg-[#059669] text-white active:scale-[0.98]' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'}`}
            >
              Complete Application <Check size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
