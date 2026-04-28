import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGlobalUserProfile, updateGlobalUserProfile } from '../../services/cooApi';
import { ArrowLeft, Save, User, Mail, Phone, ShieldCheck, ShieldAlert, Lock, Unlock, Briefcase, Calendar } from 'lucide-react';

const COOUserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: '',
    verified: false,
    is_frozen: false
  });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['coo-user-profile', id],
    queryFn: () => getGlobalUserProfile(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        verified: user.verified || false,
        is_frozen: user.is_frozen || false
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (updates: any) => updateGlobalUserProfile(id as string, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coo-user-profile', id] });
      queryClient.invalidateQueries({ queryKey: ['coo-global-users'] });
      alert('User profile updated successfully.');
    },
    onError: (err: Error) => {
      alert(`Optimization failed: ${err.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#6c11d4] animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center space-x-4">
        <ShieldAlert size={28} />
        <div>
          <h3 className="font-bold text-lg">Identity Not Found</h3>
          <p className="text-sm opacity-90">{(error as Error)?.message || 'This record does not exist or has been deleted.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-outfit">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/coo/users')}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Identity Record</h2>
            <div className="text-xs text-slate-400 font-mono mt-1">UUID: {user.id}</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {user.is_frozen ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100">
              <Lock size={16} />
              Frozen Account
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold border border-emerald-100">
              <Unlock size={16} />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Core Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Demographics</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input 
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Phone size={16} /> Phone Contact
              </label>
              <input 
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 transition-all"
              />
            </div>
          </div>

          {/* Access & Security */}
          <div className="space-y-6 border-l border-slate-50 pl-0 md:pl-8">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Authority & Security</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Briefcase size={16} /> Platform Role
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-[#6c11d4]/20 transition-all"
              >
                <option value="">Guest (None)</option>
                <option value="TENANT">Tenant</option>
                <option value="FUNDER">Funder</option>
                <option value="AGENT">Agent</option>
                <option value="SUPPORT">Support Desk</option>
                <option value="MANAGER">Manager</option>
                <option value="COO">Executives</option>
              </select>
            </div>

            <div className="pt-4 space-y-4">
              <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded text-[#6c11d4] focus:ring-[#6c11d4]"
                />
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    Verified Identity
                    {formData.verified && <ShieldCheck size={16} className="text-emerald-500" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Grants full functional access into the platform layer based on role.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30 cursor-pointer hover:bg-red-50 transition-colors">
                <input 
                  type="checkbox"
                  name="is_frozen"
                  checked={formData.is_frozen}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded text-red-600 focus:ring-red-600"
                />
                <div>
                  <div className="font-semibold text-red-800 flex items-center gap-2">
                    Freeze Account
                    {formData.is_frozen && <Lock size={16} className="text-red-600" />}
                  </div>
                  <p className="text-xs text-red-600/80 mt-1">Immediately locks the user out of the platform regardless of verified status.</p>
                </div>
              </label>
            </div>
            
            <div className="pt-2 text-sm text-slate-500 flex items-center gap-2 font-inter">
              <Calendar size={16} className="text-slate-400" />
              Registered: {new Date(user.created_at).toLocaleString()}
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-3 bg-[#6c11d4] text-white rounded-xl shadow-md hover:bg-[#5b0eaf] focus:ring-4 focus:ring-[#6c11d4]/30 disabled:opacity-50 font-bold transition-all flex items-center gap-2"
          >
            {updateMutation.isPending ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <Save size={18} />
            )}
            Save Profile Identity
          </button>
        </div>

      </form>
    </div>
  );
};

export default COOUserProfile;
