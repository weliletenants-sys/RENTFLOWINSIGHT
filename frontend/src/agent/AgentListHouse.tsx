import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Camera, User, CheckCircle2, 
  Map as MapIcon, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentListHouse() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    district: '',
    subcounty: '',
    parish: '',
    village: '',
    landmark: '',
    propertyType: '',
    units: '',
    rentPrice: '',
    availability: 'vacant',
    water: false,
    electricity: false,
    bathroomType: 'shared',
    landlordName: '',
    landlordPhone: '',
    landlordAddress: '',
    lc1Name: '',
    lc1Contact: ''
  });

  // Location/GPS State
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);

  // Photo State
  const fileInputFront = useRef<HTMLInputElement>(null);
  const fileInputInside = useRef<HTMLInputElement>(null);
  const fileInputSurround = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState({
    front: null as string | null,
    inside: null as string | null,
    surround: null as string | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation Checkers per step
  const canProceedStep1 = formData.district && formData.subcounty && formData.parish && formData.village && gpsLocation;
  const canProceedStep2 = formData.propertyType && formData.rentPrice && (formData.propertyType !== 'apartment' || formData.units);
  const canProceedStep3 = photos.front && photos.inside; // At least 2 photos required
  const canProceedStep4 = formData.landlordName && formData.landlordPhone && formData.lc1Name;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCaptureGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
          toast.success('Location locked successfully.');
        },
        (error) => {
          console.error("GPS Error:", error);
          toast.error("GPS failed. Using general proxy location for demo.");
          setGpsLocation({ lat: 0.3476, lng: 32.5825 }); // Kampala
          setIsLocating(false);
        },
        { timeout: 7000 }
      );
    } else {
      toast.error("Geolocation not supported. Proxing location.");
      setGpsLocation({ lat: 0.3476, lng: 32.5825 });
      setIsLocating(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof photos) => {
    if (e.target.files && e.target.files[0]) {
      const URL = window.URL || window.webkitURL;
      setPhotos(prev => ({
        ...prev,
        [type]: URL.createObjectURL(e.target.files![0])
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate Backend Verify & duplicate detection processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsSuccess(true);
    } catch (e) {
      toast.error('Submission failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 min-h-screen font-['Public_Sans'] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#221610]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">List Property</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add a new verified listing</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        {!isSuccess && (
          <div className="max-w-md mx-auto mt-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-bold text-[#6d28d9] uppercase tracking-widest">Step {currentStep} of {totalSteps}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {currentStep === 1 && 'Location'}
                {currentStep === 2 && 'Details'}
                {currentStep === 3 && 'Photos'}
                {currentStep === 4 && 'Landlord & Local'}
                {currentStep === 5 && 'Review'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#6d28d9] h-full rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto p-4">
        
        {/* SUCCESS STATE */}
        {isSuccess && (
          <div className="text-center space-y-6 pt-10 animate-in zoom-in-95 duration-300">
            <div className="size-24 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <ShieldCheck size={48} />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Listing Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Your listing is now <span className="font-bold text-amber-600">Pending Verification</span> by the quality team.</p>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm text-left inline-block max-w-sm w-full mx-auto border border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                 <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                   <span className="font-extrabold">UGX</span>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Potential Commission</p>
                   <p className="text-lg font-bold text-green-600">5,000</p>
                 </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Once verified (usually within 2-4 hours), the listing will become public and funds will be credited to your wallet.
               </p>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {!isSuccess && (
          <div className="space-y-6">
            
            {/* STEP 1: PROPERTY LOCATION (CRITICAL) */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-500">
                  <MapPin size={24} className="shrink-0" />
                  <p className="text-xs font-medium content-center">
                    Agent location is tracked for every listing to prevent fraudulent addresses. You must be physically at the property.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                  {/* GPS Lock */}
                  <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={handleCaptureGPS}
                      disabled={isLocating}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${gpsLocation ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-[#6d28d9]/10 text-[#6d28d9] hover:bg-[#6d28d9]/20'}`}
                    >
                      {isLocating ? (
                        <div className="size-5 border-2 border-[#6d28d9]/30 border-t-[#6d28d9] rounded-full animate-spin"></div>
                      ) : gpsLocation ? (
                        <><CheckCircle2 size={18} /> GPS Locked: {gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)}</>
                      ) : (
                        <><MapIcon size={18} /> Lock Current GPS Location</>
                      )}
                    </button>
                  </div>

                  {/* Manual Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">District</label>
                      <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. Kampala" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Subcounty/Div</label>
                      <input type="text" name="subcounty" value={formData.subcounty} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. Nakawa" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Parish/Ward</label>
                      <input type="text" name="parish" value={formData.parish} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. Ntinda" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Village/Cell</label>
                      <input type="text" name="village" value={formData.village} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. Kigoowa" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Landmark (Optional)</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="Near Tuskys" />
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Location
                </button>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 font-bold focus:ring-0 focus:border-[#6d28d9] outline-none appearance-none">
                      <option value="" disabled>Select Type...</option>
                      <option value="single_room">Single Room</option>
                      <option value="double_room">Double Room</option>
                      <option value="self_contained">Self Contained</option>
                      <option value="apartment">Apartment</option>
                      <option value="shop">Shop / Commercial</option>
                    </select>
                  </div>

                  {formData.propertyType === 'apartment' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Number of Units/Rooms</label>
                      <input type="number" name="units" value={formData.units} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 font-bold focus:ring-0 focus:border-[#6d28d9] outline-none" placeholder="e.g. 2 Bedroom" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rent Price per Month (UGX)</label>
                    <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xl font-extrabold focus:ring-0 focus:border-[#6d28d9] outline-none text-[#6d28d9]" placeholder="e.g. 150000" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex justify-center p-3 rounded-xl border-2 cursor-pointer font-bold transition-colors ${formData.availability === 'vacant' ? 'border-[#6d28d9] bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input type="radio" name="availability" value="vacant" checked={formData.availability === 'vacant'} onChange={handleInputChange} className="hidden" />
                        Vacant
                      </label>
                      <label className={`flex justify-center p-3 rounded-xl border-2 cursor-pointer font-bold transition-colors ${formData.availability === 'occupied' ? 'border-[#6d28d9] bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input type="radio" name="availability" value="occupied" checked={formData.availability === 'occupied'} onChange={handleInputChange} className="hidden" />
                        Occupied
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amenities</label>
                       <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                           <input type="checkbox" name="water" checked={formData.water} onChange={handleInputChange} className="rounded border-slate-300 text-[#6d28d9] focus:ring-[#6d28d9]" />
                           Piped Water
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                           <input type="checkbox" name="electricity" checked={formData.electricity} onChange={handleInputChange} className="rounded border-slate-300 text-[#6d28d9] focus:ring-[#6d28d9]" />
                           Electricity
                         </label>
                       </div>
                     </div>
                  </div>

                </div>

                <div className="flex gap-3">
                  <button onClick={() => setCurrentStep(1)} className="w-[30%] py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Back</button>
                  <button onClick={() => setCurrentStep(3)} disabled={!canProceedStep2} className="flex-1 py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Continue to Photos</button>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTO CAPTURE (MANDATORY LIVE) */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3 text-blue-800 dark:text-blue-500">
                  <Camera size={24} className="shrink-0" />
                  <p className="text-xs font-medium content-center">
                    Photos must be taken <b>live</b> using your camera. They will be GPS-tagged and timestamped to verify authenticity. Minimum 2 photos required.
                  </p>
                </div>

                <div className="grid gap-4">
                  
                  {/* Front View */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">1. Front External View <span className="text-red-500">*</span></label>
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 overflow-hidden">
                      {photos.front ? (
                        <>
                          <img src={photos.front} alt="Front" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Camera size={32} className="mb-2 text-slate-400" />
                          <p className="text-sm font-bold">Tap to Capture</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoUpload(e, 'front')} ref={fileInputFront} />
                    </label>
                  </div>

                  {/* Inside Room */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">2. Inside the Room <span className="text-red-500">*</span></label>
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 overflow-hidden">
                      {photos.inside ? (
                        <>
                          <img src={photos.inside} alt="Inside" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Camera size={32} className="mb-2 text-slate-400" />
                          <p className="text-sm font-bold">Tap to Capture</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoUpload(e, 'inside')} ref={fileInputInside} />
                    </label>
                  </div>

                   {/* Surroundings */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3 flex justify-between">
                      <span>3. Bath/Surroundings</span>
                      <span className="text-slate-400 text-xs">(Optional)</span>
                    </label>
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 overflow-hidden">
                      {photos.surround ? (
                        <>
                          <img src={photos.surround} alt="Surround" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Camera size={32} className="mb-2 text-slate-400" />
                          <p className="text-sm font-bold">Tap to Capture</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoUpload(e, 'surround')} ref={fileInputSurround} />
                    </label>
                  </div>

                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCurrentStep(2)} className="w-[30%] py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Back</button>
                  <button onClick={() => setCurrentStep(4)} disabled={!canProceedStep3} className="flex-1 py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Proceed</button>
                </div>
              </div>
            )}

            {/* STEP 4: LANDLORD & LOCAL VERIFICATION */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                  <h3 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
                    <User size={18} className="text-[#6d28d9]" /> Landlord Details
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Landlord Full Name</label>
                    <input type="text" name="landlordName" value={formData.landlordName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Landlord Phone Number</label>
                    <input type="tel" name="landlordPhone" value={formData.landlordPhone} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="+256 700 000000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">Landlord Address <span className="font-normal text-[10px]">(Optional)</span></label>
                    <input type="text" name="landlordAddress" value={formData.landlordAddress} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="Same logic or other place" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                  <h3 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-2 mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#6d28d9]" /> Local Council (LC1) Verification
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">Providing LC1 details massively speeds up verification.</p>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">LC1 Chairperson Name</label>
                    <input type="text" name="lc1Name" value={formData.lc1Name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="e.g. Owek. Kizito" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">LC1 Contact <span className="font-normal text-[10px]">(Optional)</span></label>
                    <input type="tel" name="lc1Contact" value={formData.lc1Contact} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#6d28d9] outline-none" placeholder="Optional phone number" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCurrentStep(3)} className="w-[30%] py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Back</button>
                  <button onClick={() => setCurrentStep(5)} disabled={!canProceedStep4} className="flex-1 py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Review Details</button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white px-2">Review Summary</h2>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden text-sm">
                  
                  {/* Location Summary */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-[#6d28d9] uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={12}/> Location & GPS</p>
                    <p className="font-bold text-slate-900 dark:text-white">{formData.district}, {formData.subcounty}</p>
                    <p className="text-slate-500">{formData.village}, {formData.parish}</p>
                    {gpsLocation && <p className="text-xs font-mono text-slate-400 mt-1">GPS: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}</p>}
                  </div>

                  {/* Property Details Summary */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-[#6d28d9] uppercase tracking-widest mb-2">Property Details</p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <span className="text-slate-500 text-xs block">Type</span>
                        <span className="font-bold capitalize">{formData.propertyType.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Rent (UGX)</span>
                        <span className="font-bold text-green-600">Ugx {parseInt(formData.rentPrice).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Availability</span>
                        <span className="font-bold capitalize">{formData.availability}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Amenities</span>
                        <span className="font-bold">{formData.water ? 'Water ' : ''}{formData.electricity ? 'Elec' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Landlord Info Summary */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-[#6d28d9] uppercase tracking-widest mb-2">Landlord</p>
                    <div className="flex justify-between items-center">
                       <div>
                         <p className="font-bold">{formData.landlordName}</p>
                         <p className="text-slate-500 text-xs">{formData.landlordPhone}</p>
                       </div>
                    </div>
                  </div>

                  {/* Photos Summary */}
                  <div className="p-4">
                    <p className="text-xs font-bold text-[#6d28d9] uppercase tracking-widest mb-2 flex items-center gap-1"><Camera size={12}/> Photos Captured</p>
                    <div className="flex gap-2">
                      <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700">
                        {photos.front && <img src={photos.front} className="w-full h-full object-cover" alt="Front" />}
                      </div>
                      <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700">
                         {photos.inside && <img src={photos.inside} className="w-full h-full object-cover" alt="Inside" />}
                      </div>
                      <div className="size-16 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold overflow-hidden bg-slate-50 dark:bg-slate-800">
                         {photos.surround ? <img src={photos.surround} className="w-full h-full object-cover" alt="Surround" /> : '+1'}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-500">
                    By submitting this listing, you confirm that you have physically visited the premises, captured original photos, and verified the landlord information. Fraudulent listings will lead to account suspension.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCurrentStep(4)} disabled={isSubmitting} className="w-[30%] py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">Back</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-70">
                    {isSubmitting ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Submit Listing'
                    )}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        )}

      </main>
    </div>
  );
}
