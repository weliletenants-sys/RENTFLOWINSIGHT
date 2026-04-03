import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ExternalLink, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import FunderDashboardHeader from './components/FunderDashboardHeader';

export default function FunderPolicyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAcceptTerms = async () => {
    setIsAccepting(true);
    try {
      const resp = await fetch('/api/funder/policy/accept', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (resp.ok) {
        setAccepted(true);
        setTimeout(() => {
          navigate('/funder');
        }, 1500);
      } else {
        alert("Failed to accept terms. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
      <FunderDashboardHeader
        user={{ fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'User', role: 'supporter', avatarUrl: '' }}
        pageTitle="Platform Agreement"
        onMenuClick={() => navigate('/funder/dashboard')}
      />

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Supporter Participation Agreement</h1>
          <p className="text-slate-500 mt-2">Please read the following terms detailing how your capital is managed.</p>
        </div>

        {/* Content Document */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8 prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed h-[60vh] overflow-y-auto">
            <h2 className="text-slate-900 font-bold text-xl mb-4">1. Understand Welile's Role</h2>
            <p className="mb-6">
              Welile Technologies Limited is a technology platform connecting verified properties, tenants, and supporters. 
              <strong> Welile is not a bank, deposit-taking institution, or regulated investment fund.</strong> All capital 
              is deployed operationally to pay rent accurately via our field-agent supervision channels.
            </p>

            <h2 className="text-slate-900 font-bold text-xl mb-4">2. The 90-Day Withdrawal Rule</h2>
            <p className="mb-6">
              Our Tenant Rent Pool capital is heavily illiquid. To ensure systemic stability while paying landlords up-front, 
              supporters must grant a mandatory <strong>90-day minimum written notice</strong> via the platform to begin a full withdrawal 
              reconciliation cycle.
            </p>

            <h2 className="text-slate-900 font-bold text-xl mb-4">3. The Assurance Mechanism</h2>
            <p className="mb-6">
              Supporter capital is shielded from physical default via a combined operational assurance framework: 15% wallet-buffer holding limits, 
              constant agent GPS verification sweeps, and Tenant Enforcement Replacement Rights transferring immediate property jurisdiction back to the operations manager upon default.
            </p>

            <h2 className="text-slate-900 font-bold text-xl mb-4">4. Angel Pool Equity</h2>
            <p className="mb-6">
              All Angel Pool investments represent strict Class B (non-voting) equity tied to a high-risk tech startup horizon. 
              There is a firm moratorium on dividends for a minimum period of 4 years.
            </p>

            {/* Fading text at the bottom to encourage scrolling if long */}
            <hr className="my-8 border-slate-100" />
            <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">End of Document Summary</p>
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Revision 1.0 (April 2026)</span>
            </div>
            
            {accepted ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-xl font-bold">
                <CheckCircle className="w-5 h-5" />
                Agreement Accepted
              </div>
            ) : (
              <button 
                onClick={handleAcceptTerms}
                disabled={isAccepting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
              >
                {isAccepting ? 'Confirming Signature...' : 'I Accept These Terms'}
                {!isAccepting && <ArrowRight className="w-4 h-4 ml-1" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
