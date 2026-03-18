import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Phone, MapPin, Map as MapIcon, Calendar, Camera, 
  CheckCircle2, AlertCircle, Clock, Send 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_TENANTS = {
  't-101': {
    id: 't-101',
    name: 'Samuel Ochieng',
    phone: '+256 700 123 456',
    location: 'Ntinda Complex, Apt 4B',
    rentStatus: 'overdue',
    outstandingBalance: 150000,
    dailyAmount: 15000,
    lastPaymentDate: '2023-10-20',
    history: [
      { date: '2023-10-20', amount: 15000, type: 'cash' },
      { date: '2023-10-19', amount: 10000, type: 'partial' },
    ]
  },
  't-102': {
    id: 't-102',
    name: 'Grace Nakato',
    phone: '+256 772 987 654',
    location: 'Bukoto Heights, Unit 12',
    rentStatus: 'partial',
    outstandingBalance: 50000,
    dailyAmount: 20000,
    lastPaymentDate: '2023-10-24',
    history: []
  }
};

type VisitStep = 'CONTEXT' | 'ACTION_SELECT' | 'RECORD_PAYMENT' | 'NO_PAYMENT' | 'SUMMARY';

export default function AgentVisitDetail() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [tenant, setTenant] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<VisitStep>('CONTEXT');
  
  // Check-in State
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action State
  const [actionType, setActionType] = useState<'RECORD' | 'PARTIAL' | 'NONE' | null>(null);
  
  // Payment State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY'>('CASH');
  
  // No Payment State
  const [noPaymentReason, setNoPaymentReason] = useState('');
  const [noPaymentNotes, setNoPaymentNotes] = useState('');

  // Summary State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate remaining
  const numPaymentAmount = parseFloat(paymentAmount.replace(/,/g, '')) || 0;
  let remainingBalance = tenant?.outstandingBalance || 0;
  
  if (actionType === 'RECORD' || actionType === 'PARTIAL') {
    remainingBalance = Math.max(0, remainingBalance - numPaymentAmount);
  }

  useEffect(() => {
    // Mock fetching tenant data
    if (tenantId && MOCK_TENANTS[tenantId as keyof typeof MOCK_TENANTS]) {
      setTenant(MOCK_TENANTS[tenantId as keyof typeof MOCK_TENANTS]);
    } else {
      // Fallback
      toast.error('Tenant not found');
      navigate('/agent-visit');
    }
  }, [tenantId, navigate]);

  const handleStartVisit = () => {
    setIsCheckingIn(true);
    
    // Simulate getting GPS location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          completeCheckIn();
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error("Could not get exact location. Using approximate.");
          // Fallback mock
          setGpsLocation({ lat: 0.3476, lng: 32.5825 });
          completeCheckIn();
        },
        { timeout: 5000 }
      );
    } else {
      // Map not supported
      setGpsLocation({ lat: 0.3476, lng: 32.5825 });
      completeCheckIn();
    }
  };

  const completeCheckIn = () => {
    setTimeout(() => {
      setIsCheckingIn(false);
      setCurrentStep('ACTION_SELECT');
      toast.success('Check-in successful!');
    }, 800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const URL = window.URL || window.webkitURL;
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmitVisit = async () => {
    setIsSubmitting(true);
    
    // Check network status
    const isOnline = navigator.onLine;

    const payload = {
      tenantId,
      timestamp: new Date().toISOString(),
      location: gpsLocation,
      action: actionType,
      collectedAmount: numPaymentAmount,
      method: paymentMethod,
      reason: noPaymentReason,
      notes: noPaymentNotes,
      hasPhoto: !!photoPreview
    };

    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!isOnline) {
        // Mock offline storage
        const queue = JSON.parse(localStorage.getItem('welile_visit_sync_queue') || '[]');
        queue.push(payload);
        localStorage.setItem('welile_visit_sync_queue', JSON.stringify(queue));
        toast.success('Saved offline. Will sync when online.', { duration: 4000 });
      } else {
        toast.success('Visit logged successfully!');
      }

      setCurrentStep('SUMMARY');
    } catch (error) {
      toast.error('Failed to log visit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tenant) return <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#221610] p-4">Loading...</div>;

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 min-h-screen font-['Public_Sans'] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#6d28d9] text-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold truncate">{tenant.name}</h1>
              <p className="text-xs font-medium text-white/80">{tenant.id}</p>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-[#5620ab] px-4 py-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-white/80">Status</span>
          <span className={`px-2 py-0.5 rounded-sm ${
            tenant.rentStatus === 'paid' ? 'bg-green-500 text-white' : 
            tenant.rentStatus === 'partial' ? 'bg-amber-500 text-white' : 
            'bg-red-500 text-white'
          }`}>
            {tenant.rentStatus}
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* --- STEP 1: CONTEXT --- */}
        {currentStep === 'CONTEXT' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Context Cards */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-14 rounded-full bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center font-bold text-2xl">
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{tenant.name}</h2>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <Phone size={14} className="mr-1.5" />
                    {tenant.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin size={14} className="mr-1.5" />
                    {tenant.location}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Outstanding</p>
                  <p className={`text-xl font-extrabold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                    UGX {tenant.outstandingBalance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Daily Rate</p>
                  <p className="text-xl font-bold">UGX {tenant.dailyAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                 <Calendar size={16} className="text-slate-400" />
               </div>
               {tenant.history.length > 0 ? (
                 <div className="space-y-3">
                   {tenant.history.map((h: any, i: number) => (
                     <div key={i} className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 font-medium">{h.date}</span>
                       <span className="font-bold text-green-600">+ UGX {h.amount.toLocaleString()}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-slate-500 italic">No recent payments recorded.</p>
               )}
            </div>

            {/* Check IN Action */}
            <div className="pt-4">
              <button 
                onClick={handleStartVisit}
                disabled={isCheckingIn}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#6d28d9] text-white font-bold text-lg hover:bg-[#5a1bb9] transition-all shadow-lg shadow-[#6d28d9]/30 disabled:opacity-70"
              >
                {isCheckingIn ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Securing GPS / Check-in...
                  </>
                ) : (
                  <>
                    <MapIcon size={20} />
                    Start Visit Check-in
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">
                Captures Location & Timestamp
              </p>
            </div>
          </div>
        )}

        {/* --- STEP 2: ACTION SELECT --- */}
        {currentStep === 'ACTION_SELECT' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-green-200 dark:border-green-900/30">
              <div className="flex items-center text-green-600 dark:text-green-500">
                <CheckCircle2 size={18} className="mr-2" />
                <span className="font-bold text-sm">Checked In</span>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                {!isCheckingIn && new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>

            <h2 className="text-lg font-bold text-center mt-6 mb-4">Select Visit Collection Outcome</h2>

            <div className="grid gap-3">
              <button 
                onClick={() => { setActionType('RECORD'); setPaymentAmount(tenant.outstandingBalance.toString()); setCurrentStep('RECORD_PAYMENT'); }}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-[#6d28d9] transition-all text-left group"
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-[#6d28d9] transition-colors">Full Payment</h3>
                  <p className="text-sm text-slate-500 mt-1">Collect UGX {tenant.outstandingBalance.toLocaleString()}</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-[#6d28d9]/10 group-hover:text-[#6d28d9] transition-colors">
                  <CheckCircle2 size={20} />
                </div>
              </button>
              
              <button 
                onClick={() => { setActionType('PARTIAL'); setPaymentAmount(''); setCurrentStep('RECORD_PAYMENT'); }}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-amber-500 transition-all text-left group"
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-amber-600 transition-colors">Partial Payment</h3>
                  <p className="text-sm text-slate-500 mt-1">Collect less than requested amount</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                  <Clock size={20} />
                </div>
              </button>

              <button 
                onClick={() => { setActionType('NONE'); setCurrentStep('NO_PAYMENT'); }}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-red-500 transition-all text-left group"
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-red-500 transition-colors">No Payment</h3>
                  <p className="text-sm text-slate-500 mt-1">Tenant failed to pay</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                  <AlertCircle size={20} />
                </div>
              </button>
            </div>
            
            {/* Optional Photo Check-in */}
            <div className="pt-6">
               <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 relative overflow-hidden">
                 {photoPreview ? (
                   <>
                     <img src={photoPreview} alt="Proof" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                     <CheckCircle2 size={20} className="text-green-500 relative z-10" />
                     <span className="font-bold text-slate-900 dark:text-white relative z-10">Photo Attached</span>
                   </>
                 ) : (
                   <>
                     <Camera size={20} />
                     <span className="font-bold">Take Proof Photo (Optional)</span>
                   </>
                 )}
                 <input 
                   type="file" 
                   accept="image/*"
                   capture="environment"
                   className="hidden"
                   ref={fileInputRef}
                   onChange={handlePhotoUpload}
                 />
               </label>
            </div>

          </div>
        )}

        {/* --- STEP 3: RECORD PAYMENT --- */}
        {currentStep === 'RECORD_PAYMENT' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentStep('ACTION_SELECT')} className="text-[#6d28d9] flex items-center font-bold text-sm">
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="text-lg font-bold">{actionType === 'RECORD' ? 'Full Payment' : 'Partial Payment'}</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amount Collected (UGX)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">UGX</span>
                  <input 
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-0 focus:border-[#6d28d9] font-bold text-xl outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${paymentMethod === 'CASH' ? 'border-[#6d28d9] bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    Cash
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('MOBILE_MONEY')}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${paymentMethod === 'MOBILE_MONEY' ? 'border-[#6d28d9] bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    Mobile Money
                  </button>
                </div>
              </div>

              {/* Dynamic Calculation */}
              <div className="bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10 p-4 rounded-xl space-y-2 border border-[#6d28d9]/20">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Balance</span>
                  <span className="font-medium text-slate-900 dark:text-white">UGX {tenant.outstandingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paying</span>
                  <span className="font-bold text-green-600">- UGX {(numPaymentAmount || 0).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-[#6d28d9]/20 flex justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">New Balance</span>
                  <span className={`font-extrabold ${remainingBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    UGX {remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {actionType === 'PARTIAL' && remainingBalance > 0 && (
                <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>Tenant misses daily target. System will flag and recalculate risk score for tomorrow.</p>
                </div>
              )}

            </div>

            <button 
              onClick={handleSubmitVisit}
              disabled={isSubmitting || numPaymentAmount <= 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#6d28d9] text-white font-bold text-lg hover:bg-[#5a1bb9] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                 <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Review & Confirm Payment'
              )}
            </button>
          </div>
        )}

        {/* --- STEP 4: NO PAYMENT --- */}
        {currentStep === 'NO_PAYMENT' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentStep('ACTION_SELECT')} className="text-[#6d28d9] flex items-center font-bold text-sm">
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <AlertCircle size={20} /> Record No-Pay
              </h2>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Reason for non-payment</label>
                <div className="grid gap-2 text-sm font-medium">
                  {['Not around', 'Financial constraints', 'Refused to pay', 'Promised later today', 'Dispute over house'].map(reason => (
                    <label key={reason} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${noPaymentReason === reason ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <input 
                        type="radio" 
                        name="reason" 
                        value={reason} 
                        checked={noPaymentReason === reason}
                        onChange={(e) => setNoPaymentReason(e.target.value)}
                        className="text-red-600 focus:ring-red-600"
                      />
                      {reason}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Agent Notes (Optional)</label>
                <textarea 
                  rows={3}
                  value={noPaymentNotes}
                  onChange={(e) => setNoPaymentNotes(e.target.value)}
                  placeholder="e.g. Met wife, husband traveling until weekend."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-0 focus:border-[#6d28d9] outline-none text-sm transition-colors resize-none"
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>Logging this will immediately impact the tenant's risk score and may trigger automated SMS actions.</p>
              </div>

            </div>

             <button 
              onClick={handleSubmitVisit}
              disabled={isSubmitting || !noPaymentReason}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                 <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Submit Risk Report'
              )}
            </button>
          </div>
        )}

        {/* --- STEP 5: SUMMARY --- */}
        {currentStep === 'SUMMARY' && (
          <div className="text-center space-y-6 pt-10 animate-in zoom-in-95 duration-300">
            <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Visit Complete!</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm text-left inline-block max-w-sm w-full mx-auto border border-slate-100 dark:border-slate-700">
              <div className="space-y-3 font-medium text-sm">
                 <div className="flex justify-between">
                   <span className="text-slate-500">Tenant</span>
                   <span className="font-bold text-slate-900 dark:text-white">{tenant.name}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500">Action Type</span>
                   <span className="font-bold text-slate-900 dark:text-white">{actionType}</span>
                 </div>
                 {(actionType === 'RECORD' || actionType === 'PARTIAL') && (
                   <>
                     <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                       <span className="text-slate-500">Amount Collected</span>
                       <span className="font-bold text-green-600 text-base">UGX {numPaymentAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-500">Current Balance</span>
                       <span className={`font-bold ${remainingBalance > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                         UGX {remainingBalance.toLocaleString()}
                       </span>
                     </div>
                   </>
                 )}
                 {actionType === 'NONE' && (
                   <div className="flex flex-col border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                       <span className="text-slate-500 text-xs uppercase mb-1">Reason Recorded</span>
                       <span className="font-bold text-red-600">{noPaymentReason}</span>
                   </div>
                 )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {actionType !== 'NONE' && (
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors">
                  <Send size={18} />
                  Share Receipt via WhatsApp
                </button>
              )}
              <button 
                onClick={() => navigate('/agent-visit')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#6d28d9] text-white font-bold hover:bg-[#5a1bb9] transition-colors"
              >
                Close & Return to List
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
