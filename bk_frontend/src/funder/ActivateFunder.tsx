import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';

const ActivateFunder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing activation link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/supporter/account-activations', {
        token,
        password
      });

      // Securely store the returned operational token representing their live session
      const receivedToken = response.data.token;
      if (receivedToken) {
        localStorage.setItem('auth_token', receivedToken);
      }

      setSuccess(true);
      
      // Auto-redirect to dashboard
      setTimeout(() => {
        navigate('/funder/account');
      }, 2000);

    } catch (err: any) {
      console.error('Activation failed:', err);
      setError(err.response?.data?.message || "Failed to activate account. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-neutral-800 rounded-2xl p-8 shadow-2xl border border-neutral-700/50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Lock className="text-blue-400 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Activate Your Portfolio</h1>
          <p className="text-neutral-400 text-sm">Create a secure password to unlock your Funder dashboard and access your capital.</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-emerald-400 font-semibold mb-2">Account Protected</h3>
            <p className="text-emerald-400/80 text-sm">Your new authorization keys are set. Redirecting to your dashboard...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Minimum 8 characters"
                  disabled={loading || !token}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Match your password exactly"
                disabled={loading || !token}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium rounded-xl py-3.5 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Secure Account'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ActivateFunder;
