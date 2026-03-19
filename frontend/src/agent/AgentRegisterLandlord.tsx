import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, User, Phone, Mail, FileText, 
  Home, Grid, DollarSign, Droplet, Zap, 
  Upload, Users, AlertCircle
} from 'lucide-react';
import PurpleBubbles from '../components/PurpleBubbles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AgentRegisterLandlord() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Landlord Details
    fullName: '',
    phoneNumber: '',
    email: '',
    idType: 'national_id',
    idNumber: '',
    idUpload: null as File | null,
    
    // Step 2: Property Details
    villageCell: '',
    subcounty: '',
    parishWard: '',
    district: '',
    propertyType: 'House',
    units: '',
    rent: '',
    ownershipConfirmed: false,
    
    // Step 3: Utility Verification
    nwscAccount: '',
    nwscNameCheck: '', // For mock API
    lightAccount: '',
    lightNameCheck: '', // For mock API
    utilityUpload: null as File | null,
    
    // Step 4: Verification Contacts
    contact1Name: '',
    contact1Phone: '',
    contact1Relation: 'Neighbor',
    contact2Name: '',
    contact2Phone: '',
    contact2Relation: 'Local Official',
    
    // Step 5: Optional Notes
    notes: '',
    extraDocs: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleNext = async () => {
    setValidationError(null);
    
    if (step === 1) {
      if (!formData.fullName || !formData.phoneNumber) {
        setValidationError("Full Name and Phone Number are required.");
        return;
      }
    }

    if (step === 3) {
      // enhanced validation mock
      setIsValidating(true);
      
      // Simulate API request delay
      await new Promise(r => setTimeout(r, 1500));
      
      // Mock Validation Logic:
      // If phone ends in 000, it fails phone validation.
      // If NWSC ends in 000, it fails NWSC validation.
      // If Light ends in 000, it fails Light validation.
      let failed = false;
      
      if (formData.phoneNumber === '0000') {
        setValidationError("Phone number does not match landlord name");
        failed = true;
      } else if (formData.nwscAccount === '0000') {
        setValidationError("NWSC account name mismatch");
        failed = true;
      } else if (formData.lightAccount === '0000') {
        setValidationError("Light account name mismatch");
        failed = true;
      }
      
      setIsValidating(false);
      
      if (failed) return; // Keep user on step 3 to fix errors
    }

    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    try {
      await axios.post('/api/agent/users/landlord', {
        name: formData.fullName,
        phone: formData.phoneNumber,
        property_address: `${formData.villageCell}, ${formData.parishWard}, ${formData.subcounty}`,
        monthly_rent: formData.rent || 0,
        house_category: formData.propertyType,
        district: formData.district,
        is_agent_managed: true,
        management_fee_rate: 10
      });
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register landlord.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen relative font-['Public_Sans'] text-slate-900 dark:text-slate-100 antialiased overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <PurpleBubbles />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        
        {/* Header */}
        <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-50">
          <button 
            onClick={() => step > 1 && !isSuccess ? handlePrev() : navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold">Register Landlord</h1>
             {!isSuccess && <p className="text-[10px] font-bold text-[#6d28d9] uppercase tracking-widest">Step {step} of 5</p>}
          </div>
          <div className="w-9" />
        </header>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
            <div 
              className="bg-[#6d28d9] h-1 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto w-full flex flex-col pb-24">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 p-6"
              >
                
                {validationError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">Verification Failed</h4>
                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">{validationError}</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Landlord Details */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Landlord Details</h2>
                      <p className="text-xs text-slate-500">Provide the personal details of the landlord.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Full Name *</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={18} />
                        <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. John Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Phone Number *</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={18} />
                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. 0700123456" />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1">This number must match the registered name.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Email (Optional)</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={18} />
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. jdoe@email.com" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="space-y-1.5 flex-[0.8]">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">ID Type</label>
                        <select name="idType" value={formData.idType} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20 appearance-none font-medium">
                          <option value="national_id">National ID</option>
                          <option value="passport">Passport</option>
                          <option value="driving_permit">Driving Permit</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">ID Number</label>
                        <input name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="CM123..." />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Upload ID/Photo (Optional)</label>
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload size={20} className="text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">Click to upload document</p>
                        </div>
                        <input type="file" className="hidden" onChange={(e) => handleFile(e, 'idUpload')} accept="image/*,.pdf" />
                      </label>
                      {formData.idUpload && <p className="text-xs text-emerald-600 font-bold ml-1 flex items-center gap-1"><CheckCircle2 size={12} /> {formData.idUpload.name}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Property Details */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Property Details</h2>
                      <p className="text-xs text-slate-500">Add the main property associated with this landlord.</p>
                    </div>

                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">District</label>
                        <input name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. Kampala" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Subcounty</label>
                        <input name="subcounty" value={formData.subcounty} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. Nakawa" />
                      </div>
                      <div className="flex gap-3">
                        <div className="space-y-1.5 flex-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Parish/Ward</label>
                          <input name="parishWard" value={formData.parishWard} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. Ntinda" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Village/Cell</label>
                          <input name="villageCell" value={formData.villageCell} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="e.g. Zone A" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Property Type</label>
                        <div className="relative group">
                          <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={16} />
                          <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20 appearance-none">
                            <option>House</option>
                            <option>Apartment</option>
                            <option>Shop</option>
                            <option>Complex</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5 w-24">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Units</label>
                        <div className="relative group">
                          <Grid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={16} />
                          <input type="number" name="units" value={formData.units} onChange={handleChange} className="w-full pl-9 pr-2 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="1" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Rent per Month (Optional)</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6d28d9]" size={18} />
                        <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20" placeholder="UGX Amount" />
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-3 p-4 bg-[#6d28d9]/5 border border-[#6d28d9]/20 rounded-xl cursor-pointer">
                      <input type="checkbox" name="ownershipConfirmed" checked={formData.ownershipConfirmed} onChange={handleChange} className="w-5 h-5 accent-[#6d28d9] rounded" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">I confirm that this person is the true owner / legal representative of this property.</span>
                    </label>

                  </div>
                )}

                {/* Step 3: Utility Verification */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Utility Verification</h2>
                      <p className="text-xs text-slate-500">Provide NWSC & Light accounts to verify identity. <br/><b>Names on accounts must match landlord's name.</b></p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Droplet size={18} />
                        <h4 className="font-bold text-sm">NWSC (Water)</h4>
                      </div>
                      <input name="nwscAccount" value={formData.nwscAccount} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent shadow-sm" placeholder="Account Number" />
                      <p className="text-[10px] text-blue-600/70 font-medium">Type "0000" to simulate a mismatch error.</p>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl space-y-3 mt-4">
                      <div className="flex items-center gap-2 text-amber-600 mb-1">
                        <Zap size={18} />
                        <h4 className="font-bold text-sm">Umeme (Electricity)</h4>
                      </div>
                      <input name="lightAccount" value={formData.lightAccount} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 border-transparent shadow-sm" placeholder="Meter / Account Number" />
                      <p className="text-[10px] text-amber-600/70 font-medium">Type "0000" to simulate a mismatch error.</p>
                    </div>

                    <div className="space-y-1.5 mt-6">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Upload Proof (Recommended)</label>
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload size={20} className="text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">Click to upload statement</p>
                        </div>
                        <input type="file" className="hidden" onChange={(e) => handleFile(e, 'utilityUpload')} accept="image/*,.pdf" />
                      </label>
                      {formData.utilityUpload && <p className="text-xs text-emerald-600 font-bold ml-1 flex items-center gap-1"><CheckCircle2 size={12} /> {formData.utilityUpload.name}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Verification Contacts */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Verification Contacts</h2>
                      <p className="text-xs text-slate-500">Provide two local officials or neighbors to verify.</p>
                    </div>

                    {/* Contact 1 */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="font-bold text-sm text-[#6d28d9] flex items-center gap-2"><Users size={16}/> Contact 1</h4>
                      <input name="contact1Name" value={formData.contact1Name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#6d28d9]/20 text-sm" placeholder="Full Name" />
                      <div className="flex gap-2">
                        <input name="contact1Phone" value={formData.contact1Phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#6d28d9]/20 text-sm flex-1" placeholder="Phone" />
                        <select name="contact1Relation" value={formData.contact1Relation} onChange={handleChange} className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm w-32">
                          <option>Neighbor</option>
                          <option>LC / Official</option>
                          <option>Relative</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact 2 */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="font-bold text-sm text-[#6d28d9] flex items-center gap-2"><Users size={16}/> Contact 2</h4>
                      <input name="contact2Name" value={formData.contact2Name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#6d28d9]/20 text-sm" placeholder="Full Name" />
                      <div className="flex gap-2">
                        <input name="contact2Phone" value={formData.contact2Phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#6d28d9]/20 text-sm flex-1" placeholder="Phone" />
                        <select name="contact2Relation" value={formData.contact2Relation} onChange={handleChange} className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm w-32">
                          <option>Neighbor</option>
                          <option>LC / Official</option>
                          <option>Relative</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Optional Notes */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-1">Final Details</h2>
                      <p className="text-xs text-slate-500">Add any additional documents or notes.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Additional Documents</label>
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload size={20} className="text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">Upload tenancy agreement, etc.</p>
                        </div>
                        <input type="file" className="hidden" onChange={(e) => handleFile(e, 'extraDocs')} accept="image/*,.pdf" />
                      </label>
                      {formData.extraDocs && <p className="text-xs text-emerald-600 font-bold ml-1 flex items-center gap-1"><CheckCircle2 size={12} /> {formData.extraDocs.name}</p>}
                    </div>

                    <div className="space-y-1.5 mt-6">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Notes</label>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#6d28d9]" size={18} />
                        <textarea 
                          name="notes" value={formData.notes} onChange={handleChange} 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/20 min-h-[120px] resize-none" 
                          placeholder="Special instructions or observations..." 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

            ) : (
              // Success Screen
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Registration Submitted!</h2>
                
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[300px] leading-relaxed">
                  The landlord registration for <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</span> has been securely logged and is pending final verifications.
                </p>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/agent-clients')}
                    className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6d28d9]/25"
                  >
                    View Clients
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 px-6 rounded-xl transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="fixed sm:absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
            {step < 5 ? (
              <button 
                onClick={handleNext}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 bg-[#6d28d9] disabled:bg-[#6d28d9]/50 hover:bg-[#5b21b6] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#6d28d9]/25 transition-all outline-none"
              >
                {isValidating ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    <span>Verifying Mismatches...</span>
                  </>
                ) : (
                  <span>Next Step</span>
                )}
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 disabled:bg-emerald-600/50 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/25 transition-all outline-none"
              >
                {isValidating ? (
                  <>
                     <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                     <span>Submitting...</span>
                  </>
                ) : (
                  <>
                     <CheckCircle2 size={20} />
                     <span>Submit Verification</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
