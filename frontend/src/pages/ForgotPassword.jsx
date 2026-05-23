import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import horizontalLogo from '../assets/horziontal logo.png';
import { axiosInstance } from '../config/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/auth/forgotpassword', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
               Forgot password?
             </h1>
             <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">
               Enter your email and we'll send you a link to reset your password.
             </p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-authra-text-light dark:text-white mb-2">Check your email</h3>
                <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com" 
                      className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white font-[510] text-sm rounded-xl p-3 shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
