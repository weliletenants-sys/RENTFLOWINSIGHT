import React, { useState, useEffect } from 'react';
import { fetchOpportunities, createOpportunity } from '../../services/cooApi';

export const COOOpportunities = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bedrooms: '',
    rent_required: '',
    status: 'available',
    image_url: ''
  });

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const responseData = await fetchOpportunities();
      setOpportunities(responseData.data || responseData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.rent_required || !formData.bedrooms) {
        setError('Please fill in all required fields.');
        return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createOpportunity(formData);
      await loadOpportunities(); // Refresh the list
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        bedrooms: '',
        rent_required: '',
        status: 'available',
        image_url: ''
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Virtual Opportunities</h2>
          <p className="text-slate-500 text-sm">Manage housing supply for the Funder Marketplace</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white dark:bg-inverse-on-surface rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Pipeline Registration</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Property Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kampala Heights Apt 4B"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Makindye, Kampala"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bedrooms</label>
                <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
                    required
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target (UGX)</label>
                <input
                    type="number"
                    name="rent_required"
                    value={formData.rent_required}
                    onChange={handleChange}
                    placeholder="850000"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
                    required
                />
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Image URL (Optional)</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://s3.amazonaws.com/..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Market Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-800 dark:text-white transition-all"
                required
              >
                <option value="available">Available (Green)</option>
                <option value="urgent">Urgent (Red)</option>
                <option value="taken">Taken (Gray Out)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-primary text-white font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Injecting Data...' : 'Broadcast to Marketplace'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white dark:bg-inverse-on-surface rounded-3xl p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Live Properties</h3>
             
             <div className="overflow-x-auto">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>
                      ))}
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        No virtual properties staged for the marketplace yet.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Unit Name</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Capital Requisite</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {opportunities.map((opp) => (
                                <tr key={opp.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 font-medium text-slate-800 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                                                {opp.image_url ? (
                                                    <img src={opp.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-lg">home</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p>{opp.name}</p>
                                                <p className="text-xs text-slate-500 font-normal">{opp.bedrooms} Beds</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-600 dark:text-slate-400">{opp.location}</td>
                                    <td className="py-4 font-bold text-slate-800 dark:text-white">UGX {Number(opp.rent_required).toLocaleString()}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            opp.status === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                            opp.status === 'taken' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                        }`}>
                                            {opp.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default COOOpportunities;
