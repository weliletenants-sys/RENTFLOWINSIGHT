import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function LoanPaymentCalculator() {
  const [amount, setAmount] = useState('100000');
  const [days, setDays] = useState('14');

  // Basic mock calculation logic based on 2% weekly base rate
  const fee = parseInt(amount) * 0.04; 
  const total = parseInt(amount) + fee;

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 tracking-wide">Advance Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Request Amount</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#512DA8] transition-all text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Repayment Period (Days)</label>
           <select 
             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#512DA8] transition-all text-sm appearance-none"
             value={days}
             onChange={(e) => setDays(e.target.value)}
           >
             <option value="7">7 Days</option>
             <option value="14">14 Days</option>
             <option value="30">30 Days</option>
           </select>
        </div>

        <div className="bg-gray-50 p-4 border border-gray-200 border-dashed rounded-xl mt-2 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium">Repayment Total</p>
            <div className="text-lg font-black text-[#512DA8]">UGX {total.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Access Fee</p>
            <div className="text-sm font-bold text-gray-700">UGX {fee.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
