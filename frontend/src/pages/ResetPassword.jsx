import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import horizontalLogo from '../assets/horziontal logo.png';
import { axiosInstance } from '../config/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await axiosInstance.put(`/auth/resetpassword/${token}`, { password });
      navigate('/login', { state: { message: 'Password updated successfully. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] flex font-inter items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-steel/10 blur-[100px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-periwinkle/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={horizontalLogo} alt="Authra" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 dark:bg-[#111522]/80 backdrop-blur-xl border border-authra-border-light dark:border-[#2A3155] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        >
          <div className="mb-8 text-center">
             <h1 className="text-2xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight mb-2">
               Create new password
             </h1>
             <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">
               Please enter your new password below.
             </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-10 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-10 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white font-[510] text-sm rounded-xl p-3 shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
