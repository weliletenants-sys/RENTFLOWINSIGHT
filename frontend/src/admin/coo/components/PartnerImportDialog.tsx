import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, AlertTriangle, CheckCircle, Download, FileSpreadsheet, Users, Briefcase, XCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { importPartners, validatePartnersImport } from '../../../services/cooApi';
import * as XLSX from 'xlsx';

interface PartnerImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PartnerImportDialog: React.FC<PartnerImportDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rawPartners, setRawPartners] = useState<any[]>([]);
  const [validationData, setValidationData] = useState<any>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setFilename('');
    setRawPartners([]);
    setValidationData(null);
    setError(null);
    onClose();
  };

  const processFile = (file: File) => {
    setLoading(true);
    setError(null);
    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          throw new Error("The uploaded Excel file is empty.");
        }

        const partners = data.map((row: any) => {
           const getVal = (keys: string[]) => {
              const key = Object.keys(row).find(k => keys.some(searchKey => k.toLowerCase().includes(searchKey.toLowerCase())));
              return key ? row[key] : undefined;
           };

           return {
              name: getVal(['name', 'supporter']),
              phone: getVal(['phone', 'mobile']),
              email: getVal(['email']),
              amount: parseFloat(String(getVal(['amount', 'principal'])).replace(/[^0-9.-]+/g,"")) || 0,
              date: getVal(['date', 'contribution']),
              roi: parseFloat(getVal(['roi', 'rate'])) || 15,
              duration: parseInt(getVal(['duration', 'months'])) || 12,
              roiMode: getVal(['mode']) || 'monthly_compounding'
           };
        }).filter((p: any) => p.amount > 0);

        if (partners.length === 0) {
          throw new Error("No valid rows with an Investment Amount were found.");
        }

        setRawPartners(partners);

        // Validate on backend
        const valRes = await validatePartnersImport(partners);
        setValidationData(valRes);
        setStep(2);

      } catch (err: any) {
        setError(err.message || 'Failed to process Excel file.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const executeImport = async () => {
    try {
      setLoading(true);
      await importPartners(rawPartners);
      onSuccess();
      handleClose();
    } catch(err: any) {
      setError(err.message || 'Import failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col font-inter overflow-hidden">
        
        {/* Header stays persistent */}
        <div className="p-8 pb-4 shrink-0 flex justify-between items-start border-b border-transparent">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#8B3DFF]/10 text-[#8B3DFF] rounded-lg">
                <FileSpreadsheet size={24} />
              </div>
              <h2 className="text-2xl font-bold font-outfit text-slate-800">Import Partners & Portfolios</h2>
            </div>
            <p className="text-slate-500 font-medium ml-1">
              {step === 1 && "Upload an Excel file with partner and portfolio data"}
              {step === 2 && `Reviewing ${filename}`}
              {step === 3 && `Confirm import details before processing`}
            </p>
          </div>
          <button onClick={handleClose} disabled={loading} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        <div className="px-8 pb-8 overflow-y-auto w-full">
          {error && (
             <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-4">
               <AlertTriangle className="shrink-0 mt-0.5" size={18} />
               <p className="text-sm font-medium">{error}</p>
             </div>
          )}

          {/* STEP 1: UPLOAD */}
          {step === 1 && (
             <div className="pt-4 animate-in fade-in slide-in-from-right-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) processFile(f); }}
                  className={`w-full border-[2px] border-dashed rounded-[24px] p-12 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-[#8B3DFF] bg-[#8B3DFF]/5' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  } ${loading ? 'opacity-50 pointer-events-none cursor-wait' : ''}`}
                >
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 text-[#8B3DFF] animate-spin mb-4" />
                      <p className="text-lg font-bold text-slate-700">Analyzing Data...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-12 h-12 text-slate-400 mb-4" />
                      <p className="text-lg font-bold text-slate-800 mb-2 mt-1">Drop Excel file here or click to browse</p>
                      <p className="text-sm text-slate-500 mb-4">Supports .xlsx files, max 500 rows</p>
                      <p className="text-[13px] text-slate-400 max-w-lg mb-6 leading-relaxed">
                        Accepts flexible headers: "Supporter Name", "Principal (UGX)", "Rate", "Contribution Date", etc.
                      </p>
                      <div className="bg-amber-50 rounded-xl p-3 inline-flex items-center text-left mx-auto">
                        <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed max-w-sm">
                           <span className="mr-1">💡</span>
                           Phone is optional. Multiple portfolios per partner? Use the same <strong className="font-bold text-amber-800">phone number</strong> on each row — they'll be grouped automatically.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center pb-2">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       const ws = XLSX.utils.json_to_sheet([{
                          "Supporter Name": "Pius", "Phone": "0770000000", "Email": "pius@mail.com",
                          "Principal (UGX)": "20000000", "Contribution Date": new Date().toISOString().split('T')[0],
                          "Rate (%)": 15, "Duration (Months)": 12, "ROI Mode": "monthly_compounding"
                       }]);
                       const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Template");
                       XLSX.writeFile(wb, "Partner_Import_Template.xlsx");
                     }}
                     disabled={loading}
                     className="flex items-center px-6 py-3 font-bold text-[#8B3DFF] bg-white border border-[#8B3DFF] hover:bg-[#8B3DFF]/5 rounded-xl transition-colors min-w-[200px] justify-center"
                   >
                     <Download size={18} className="mr-2" /> Download Template
                   </button>
                </div>
             </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 2 && validationData && (
             <div className="pt-2 animate-in fade-in slide-in-from-right-4">
                <div className="flex gap-4 mb-6">
                   <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                     <Users className="text-[#8B3DFF] w-6 h-6 absolute top-4 left-4" />
                     <p className="text-3xl font-black text-slate-800 mt-2 mb-1">{validationData.summary.newPartners}</p>
                     <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">New Partners</p>
                   </div>
                   <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                     <Briefcase className="text-emerald-600 w-6 h-6 absolute top-4 left-4" />
                     <p className="text-3xl font-black text-slate-800 mt-2 mb-1">{validationData.summary.portfolios}</p>
                     <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Portfolios</p>
                   </div>
                   <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                     <AlertTriangle className="text-amber-500 w-6 h-6 absolute top-4 left-4" />
                     <p className="text-3xl font-black text-slate-800 mt-2 mb-1">{validationData.summary.existing}</p>
                     <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Existing</p>
                   </div>
                   <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                     <XCircle className="text-red-500 w-6 h-6 absolute top-4 left-4" />
                     <p className="text-3xl font-black text-slate-800 mt-2 mb-1">{validationData.summary.errors}</p>
                     <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Errors</p>
                   </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
                   {validationData.groups.map((group: any, idx: number) => (
                      <div key={idx} className="border border-amber-100 bg-amber-50/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                         <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                               <AlertTriangle size={18} className="text-amber-500" />
                               <h3 className="font-bold text-slate-800 uppercase tracking-tight">{group.name}</h3>
                               {group.phone && <span className="text-slate-500 text-sm">{group.phone}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-black text-slate-500">{group.portfolios.length} portfolios</span>
                               {group.existing && (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                    Existing
                                  </span>
                               )}
                            </div>
                         </div>
                         <div className="space-y-1">
                            {group.portfolios.map((p: any, i: number) => (
                               <div key={i} className="flex gap-4 text-sm font-medium text-slate-500 items-center justify-start ml-7">
                                  <span className="w-32 truncate">USh {p.amount.toLocaleString()}</span>
                                  <span className="w-16">{p.roi}% ROI</span>
                                  <span className="w-12">{p.duration}mo</span>
                                  <span className="w-32 truncate">{p.roiMode.replace('_', ' ')}</span>
                                  {p.date && <span className="text-indigo-400/80 tracking-wide text-xs">📅 {p.date}</span>}
                               </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && validationData && (
             <div className="pt-2 animate-in fade-in slide-in-from-right-4">
                <div className="bg-[#8B3DFF]/5 border border-[#8B3DFF]/20 rounded-2xl p-8 mb-4">
                   <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-[#8B3DFF]" size={24} />
                      <h3 className="text-xl font-bold font-outfit text-slate-800">COO Confirmation Required</h3>
                   </div>
                   
                   <p className="text-slate-600 text-[15px] mb-4">
                      You are about to create <strong className="text-slate-800">{validationData.summary.newPartners} partner accounts</strong> with <strong className="text-slate-800">{validationData.summary.portfolios} investment portfolios</strong> totaling <strong className="text-slate-800">USh {validationData.summary.totalCapital.toLocaleString()}</strong>.
                   </p>
                   
                   {validationData.summary.existing > 0 && (
                      <p className="text-orange-600 font-bold text-sm mb-6 flex items-center">
                         <span className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center mr-2 text-[10px]">&iexcl;</span>
                         {validationData.summary.existing} existing partner(s) — portfolios will be added to their accounts.
                      </p>
                   )}
                   
                   <div className="border-t border-[#8B3DFF]/10 my-4" />

                   <ul className="space-y-3 mt-6">
                      <li className="flex items-start gap-2 text-sm text-slate-500 font-medium before:content-['•'] before:text-slate-300 before:text-lg before:leading-[14px]">
                         Full user accounts will be created (can log in)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-500 font-medium before:content-['•'] before:text-slate-300 before:text-lg before:leading-[14px]">
                         Portfolios start with <strong className="text-slate-700 font-bold mx-1">active</strong> status
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-500 font-medium before:content-['•'] before:text-slate-300 before:text-lg before:leading-[14px]">
                         Wallet buckets explicitly register the offline injected capital metrics securely
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-500 font-medium before:content-['•'] before:text-slate-300 before:text-lg before:leading-[14px]">
                         If a contribution date is provided, it will be used as the portfolio start date
                      </li>
                   </ul>
                </div>
             </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        {step > 1 && (
           <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-[24px]">
              <button 
                onClick={() => setStep((s) => s - 1 as 1|2|3)} 
                disabled={loading}
                className="px-6 py-3 font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center shadow-sm disabled:opacity-50"
              >
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              
              {step === 2 && (
                 <button 
                   onClick={() => setStep(3)}
                   disabled={loading}
                   className="px-6 py-3 font-bold text-white bg-[#8B3DFF] hover:bg-[#7220e8] rounded-xl transition-colors flex items-center shadow-sm"
                 >
                   Review & Confirm <ArrowRight size={18} className="ml-2" />
                 </button>
              )}

              {step === 3 && (
                 <button 
                   onClick={executeImport}
                   disabled={loading}
                   className="px-8 py-3 font-bold text-white bg-[#8B3DFF] hover:bg-[#7220e8] rounded-xl transition-colors flex items-center shadow-sm"
                 >
                   {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <ShieldCheck size={18} className="mr-2" />}
                   Confirm & Import
                 </button>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default PartnerImportDialog;
