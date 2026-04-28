import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RentRequestForm() {
  const { rentAmount, setRentAmount } = useAuth();
  
  // Example states for the new form fields
  const [occupation, setOccupation] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [parish, setParish] = useState('');
  const [village, setVillage] = useState('');

  const navigate = useNavigate();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Move to step 2 (currently we'll just navigate or show a toast)
    console.log("Proceeding to next step...");
    navigate('/signup'); // Or wherever step 2 should actually go
  };

  return (
    <div className="min-h-screen bg-[#111827] sm:p-4 flex justify-center items-center relative overflow-hidden font-sans">
      
      {/* Phone container */}
      <div className="w-full min-h-screen bg-white relative flex flex-col overflow-hidden z-10">
        
        {/* Header Section */}
        <div className="pt-12 pb-4 px-6 flex items-center justify-between bg-white relative z-20">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="text-center flex-1 pr-10"> {/* pr-10 to offset the back button visually */}
            <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Rent Financing</h1>
            <p className="text-[#64748B] text-sm">Step 1 of 4</p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full flex h-1 bg-gray-100 relative mb-6">
           {/* Active Step Indicator */}
           <div className="w-1/4 h-full bg-[#51319E] absolute left-0 top-0"></div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Mock Auto-filled Section */}
          <div className="bg-[#FAF8FF] border border-[#F1EAFC] rounded-2xl p-4 mb-8">
            <h3 className="text-[#2F1069] font-bold text-[15px] mb-1">Personal Info (Auto-filled)</h3>
            <p className="text-[#6A4EAA] text-sm leading-relaxed">
              Name: Kahunde Florence<br/>
              Phone: Verified (+256...)
            </p>
          </div>

          <form onSubmit={handleNextStep}>
            
            {/* Location & Work Section */}
            <h2 className="text-lg font-black text-[#0F172A] mb-4">Location & Work</h2>
            
            <div className="space-y-4 mb-8">
              <input 
                type="text" 
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
              />
              <input 
                type="text" 
                placeholder="Work Address"
                value={workAddress}
                onChange={(e) => setWorkAddress(e.target.value)}
                className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
              />
              <input 
                type="text" 
                placeholder="Home Address"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
              />
              <input 
                type="text" 
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
              />
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Sub-County"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="w-1/2 bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
                <input 
                  type="text" 
                  placeholder="Parish"
                  value={parish}
                  onChange={(e) => setParish(e.target.value)}
                  className="w-1/2 bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
              </div>

              <input 
                type="text" 
                placeholder="Village / Cell"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
              />
            </div>

            {/* Rent Details Section */}
            <h2 className="text-lg font-black text-[#0F172A] mb-4">Rent Details</h2>
            <div className="space-y-4">
               <input 
                  type="number" 
                  placeholder="Requested Rent Amount (UGX)"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
            </div>

          </form>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm pt-4 pb-8 px-6 border-t border-gray-50 flex justify-center z-30">
           <button 
             onClick={handleNextStep}
             className="w-[95%] bg-[#51319E] hover:bg-[#412780] text-white py-[18px] rounded-2xl font-bold text-[16px] shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
           >
             Next Step <ArrowRight size={20} strokeWidth={2.5} />
           </button>
        </div>

      </div>
    </div>
  );
}
