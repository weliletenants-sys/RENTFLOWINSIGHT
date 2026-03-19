import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, ChevronRight, ShieldCheck, User, Briefcase, FileText, ChevronLeft, UploadCloud } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

export default function FunderKYCOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // File Upload State
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Identity
    legalName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    dateOfBirth: '',
    gender: '',
    // Step 2: KYC
    idType: 'national_id',
    idNumber: '',
    tin: '',
    // Step 3: Source of Funds
    employmentStatus: '',
    primarySource: '',
    investmentBand: '',
    // Step 4: Succession
    nokName: '',
    nokPhone: '',
    nokRelationship: '',
    // Step 5: Terms
    agreedToTerms: false,
    agreedToRisks: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      if (side === 'front') setIdFront(e.target.files[0]);
      else setIdBack(e.target.files[0]);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.legalName.trim() !== '' && formData.dateOfBirth !== '' && formData.gender !== '';
      case 2:
        return formData.idType !== '' && formData.idNumber.trim() !== '' && idFront !== null && idBack !== null;
      case 3:
        return formData.employmentStatus !== '' && formData.primarySource !== '' && formData.investmentBand !== '';
      case 4:
        return formData.nokName.trim() !== '' && formData.nokRelationship.trim() !== '' && formData.nokPhone.trim() !== '';
      case 5:
        return formData.agreedToTerms && formData.agreedToRisks;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNextStep()) setCurrentStep(prev => Math.min(prev + 1, 5) as Step);
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as Step);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay for KYC submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: 'Identity', icon: <User className="w-4 h-4" /> },
      { num: 2, label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
      { num: 3, label: 'Capital', icon: <Briefcase className="w-4 h-4" /> },
      { num: 4, label: 'Succession', icon: <User className="w-4 h-4" /> },
      { num: 5, label: 'Sign', icon: <FileText className="w-4 h-4" /> },
    ];

    return (
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-[20px] top-[20px] -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" style={{ width: 'calc(100% - 40px)' }} />
        <div 
          className="absolute left-[20px] top-[20px] -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full z-0 transition-all duration-300"
          style={{ width: `calc(${((currentStep - 1) / 4) * 100}% - ${((currentStep - 1) / 4) * 40}px)` }}
        />
        
        {steps.map(step => (
          <div key={step.num} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                currentStep >= step.num 
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-purple-500/20' 
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}
            >
              {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
            </div>
            <span className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${
              currentStep >= step.num ? 'text-[var(--color-primary)]' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  /* ═══════════ COMPLETION SCREEN ═══════════ */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center slide-up">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Verification Submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Thank you for completing your compliance profile. Our team is currently reviewing your documents. 
            You will receive an email once your Funder Wallet is activated.
          </p>
          <button 
            onClick={() => navigate('/funder')}
            className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-[0.98]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--color-primary-shadow)]">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activate Your Account</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto">
            To comply with financial regulations and secure the Rent Management Pool, we need to verify your identity.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 pb-0">
            {renderStepIndicator()}
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4">
            
            {/* ════ STEP 1: IDENTITY ════ */}
            {currentStep === 1 && (
              <div className="space-y-6 fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Legal Identity</h3>
                  <p className="text-xs text-slate-500 mt-1">Please ensure this matches your official government ID perfectly.</p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Legal Name</label>
                  <input
                    type="text"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    placeholder="Enter exactly as shown on ID"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 2: COMPLIANCE ════ */}
            {currentStep === 2 && (
              <div className="space-y-6 fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Compliance & KYC</h3>
                  <p className="text-xs text-slate-500 mt-1">Upload your primary identification documents.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ID Type</label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    >
                      <option value="national_id">National ID (NIN)</option>
                      <option value="passport">Passport</option>
                      <option value="driving_permit">Driving Permit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ID Document Number</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900 uppercase"
                      placeholder="e.g. CM8423XX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    name="tin"
                    value={formData.tin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    placeholder="Optional for starting tier"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Upload ID Documents (Front & Back)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[var(--color-primary)] transition-all cursor-pointer group bg-white h-32 relative overflow-hidden">
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'front')} />
                      {idFront ? (
                        <div className="flex flex-col items-center text-[var(--color-primary)]">
                          <CheckCircle2 className="w-8 h-8 mb-2" />
                          <p className="text-xs font-bold truncate max-w-[150px]">{idFront.name}</p>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors mb-2" />
                          <p className="text-xs font-bold text-slate-700">ID Front side</p>
                        </>
                      )}
                    </label>

                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[var(--color-primary)] transition-all cursor-pointer group bg-white h-32 relative overflow-hidden">
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'back')} />
                      {idBack ? (
                        <div className="flex flex-col items-center text-[var(--color-primary)]">
                          <CheckCircle2 className="w-8 h-8 mb-2" />
                          <p className="text-xs font-bold truncate max-w-[150px]">{idBack.name}</p>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors mb-2" />
                          <p className="text-xs font-bold text-slate-700">ID Back side</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 3: SOURCE OF FUNDS ════ */}
            {currentStep === 3 && (
              <div className="space-y-6 fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Source of Funds / Wealth</h3>
                  <p className="text-xs text-slate-500 mt-1">Anti-Money Laundering (AML) reporting requirements.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Employment Status</label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed / Business Owner</option>
                    <option value="Retired">Retired</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Primary Source of Wealth</label>
                  <select
                    name="primarySource"
                    value={formData.primarySource}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    required
                  >
                    <option value="">Select source</option>
                    <option value="Salary">Salary / Savings</option>
                    <option value="Business Profits">Business Profits</option>
                    <option value="Inheritance">Inheritance / Gift</option>
                    <option value="Investment Returns">Investment Returns</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Expected Annual Investment Volume (UGX)</label>
                  <select
                    name="investmentBand"
                    value={formData.investmentBand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    required
                  >
                    <option value="">Select investment band</option>
                    <option value="< 10M">Under 10,000,000 UGX</option>
                    <option value="10M - 50M">10,000,000 - 50,000,000 UGX</option>
                    <option value="50M - 200M">50,000,000 - 200,000,000 UGX</option>
                    <option value="> 200M">Above 200,000,000 UGX</option>
                  </select>
                </div>
              </div>
            )}

            {/* ════ STEP 4: SUCCESSION ════ */}
            {currentStep === 4 && (
              <div className="space-y-6 fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Succession Planning</h3>
                  <p className="text-xs text-slate-500 mt-1">Specify your Next of Kin to secure your portfolio assets.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Next of Kin Full Name</label>
                  <input
                    type="text"
                    name="nokName"
                    value={formData.nokName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Relationship</label>
                    <input
                      type="text"
                      name="nokRelationship"
                      value={formData.nokRelationship}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                      placeholder="e.g. Spouse, Child, Sibling"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      name="nokPhone"
                      value={formData.nokPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium text-slate-900"
                      placeholder="+256 7..."
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 5: TERMS & SIGN ════ */}
            {currentStep === 5 && (
              <div className="space-y-6 fade-in">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Final Verification</h3>
                  <p className="text-xs text-slate-500 mt-1">Review the Master Service Agreement and Risk profile.</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar text-xs text-slate-600 leading-relaxed mb-6 space-y-4">
                  <p><strong>1. Introduction</strong><br/>By acknowledging this document, you (the "Funder") agree to the terms binding the Rent Management Pool capital provisions hosted by Welile Platform.</p>
                  <p><strong>2. Risk Acknowledgment</strong><br/>All real estate funding carries inherent risk. Yield projections are estimates based on active tenancy behavior. Past performance does not guarantee future rent pool stability.</p>
                  <p><strong>3. 90-Day Liquidity Clause</strong><br/>You explicitly acknowledge that capital deposited into the master Rent Pool is locked. Direct withdrawal requests require a mandatory 90-day notice period to ensure platform solvency, during which standard ROI is paused.</p>
                  <p><strong>4. Verification Honesty</strong><br/>You certify under penalty of perjury that all identity and source of wealth documentation provided herein is accurate and legitimate.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleCheckbox}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]"
                        required
                      />
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                      I have read, understood, and agree to the <span className="text-[var(--color-primary)] font-bold">Master Service Agreement.</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        name="agreedToRisks"
                        checked={formData.agreedToRisks}
                        onChange={handleCheckbox}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]"
                        required
                      />
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                      I acknowledge the the <span className="font-bold">90-Day Liquidity protocols</span> and general investment risks.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className={`mt-10 pt-6 border-t border-slate-100 flex items-center ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all ml-auto ${
                    canProceedToNextStep() 
                      ? 'bg-[var(--color-primary)] text-white hover:shadow-lg active:scale-[0.98]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.agreedToTerms || !formData.agreedToRisks || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all ml-auto ${
                    (formData.agreedToTerms && formData.agreedToRisks && !isSubmitting)
                    ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-[0.98] cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Complete Verification <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
