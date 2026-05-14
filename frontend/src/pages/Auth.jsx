import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Phone, Globe, UploadCloud } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import horizontalLogo from '../assets/horziontal logo.png';
import { axiosInstance } from '../config/api';

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [authType, setAuthType] = useState('user'); // 'user' or 'organization'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const navigate = useNavigate();

  // Update form type when route changes (e.g. clicking "Get Started" from navbar)
  React.useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
    setError('');
  }, [location.pathname]);

  const toggleAuthMode = () => {
    setError('');
    if (isLogin) {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const res = await axiosInstance.post('/auth/login', { email, password });
        if (res.data.accountType === 'organization') {
          navigate('/dashboard');
        } else {
          navigate(`/user/${res.data.username || 'profile'}`); 
        }
      } else {
        const payload = {
          accountType: authType,
          email,
          password,
        };
        if (authType === 'organization') {
          payload.orgName = orgName;
          payload.mobileNo = mobileNo;
          payload.website = website;
          payload.linkedin = linkedin;
          const res = await axiosInstance.post('/auth/register', payload);
          navigate('/dashboard');
        } else {
          navigate('/onboarding', { state: { email, password } });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google SVG
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] flex font-inter">
      {/* Ambient background for mobile */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden lg:hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-steel/10 blur-[100px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-periwinkle/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Left side branding (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111522] border-r border-[#2A3155] p-12 flex-col justify-between overflow-hidden">
        {/* Background Grid & Orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 blur-[120px] rounded-full mix-blend-screen" />
        
        <div className="relative z-10">
          <a href="/">
            <img src={horizontalLogo} alt="Authra" className="h-8 w-auto object-contain" />
          </a>
        </div>
        
        <div className="relative z-10 max-w-lg mb-20">
          <h1 className="text-4xl lg:text-5xl font-[590] text-white tracking-tight leading-[1.1] mb-6">
            Build your professional identity.
          </h1>
          <p className="text-lg text-[#9AA8D6]">
            Showcase skills, earn cryptographically verified certificates, and discover elite opportunities.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 text-sm text-[#9AA8D6]">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      {/* Right side auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Header */}
        <div className="absolute top-8 left-6 lg:hidden">
          <a href="/">
            <img src={horizontalLogo} alt="Authra" className="h-7 w-auto object-contain" />
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Text */}
          <div className="lg:hidden mb-8 mt-12">
            <h1 className="text-2xl sm:text-3xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-authra-text-sec-light dark:text-[#9AA8D6] text-sm">
              Build your professional identity on Authra.
            </p>
          </div>

          <div className="hidden lg:block mb-8 text-center">
             <h2 className="text-2xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight">
               {isLogin ? 'Sign in to Authra' : 'Create your account'}
             </h2>
          </div>

          <div className="bg-white/80 dark:bg-[#111522]/80 backdrop-blur-xl border border-authra-border-light dark:border-[#2A3155] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            
            <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] text-authra-text-light dark:text-[#F5F8FF] font-medium rounded-xl p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-authra-border-light dark:bg-[#2A3155] flex-1"></div>
              <span className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-wider">Or</span>
              <div className="h-px bg-authra-border-light dark:bg-[#2A3155] flex-1"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthType('user')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authType === 'user' ? 'bg-white dark:bg-[#111522] shadow-sm text-authra-text-light dark:text-white' : 'text-authra-text-sec-light dark:text-[#9AA8D6]'}`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setAuthType('organization')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authType === 'organization' ? 'bg-white dark:bg-[#111522] shadow-sm text-authra-text-light dark:text-white' : 'text-authra-text-sec-light dark:text-[#9AA8D6]'}`}
                >
                  Organization
                </button>
              </div>

              {!isLogin && authType === 'organization' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Organization Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Building2 className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                      </div>
                      <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required placeholder="Acme Corp" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">{!isLogin && authType === 'organization' ? 'Work Email' : 'Email address'}</label>
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

              {!isLogin && authType === 'organization' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Mobile No</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                        </div>
                        <input type="tel" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required placeholder="+1 234 567" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Website</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Globe className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                        </div>
                        <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">LinkedIn</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <LinkedinIcon className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                        </div>
                        <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Logo</label>
                      <div className="relative flex items-center w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl px-3 py-2 cursor-pointer hover:border-brand-steel transition-all">
                        <UploadCloud className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6] mr-2" />
                        <span className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] truncate">Upload image</span>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Password</label>
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
                {isLogin && (
                  <div className="flex justify-end pt-1">
                    <a href="#" className="text-xs font-medium text-brand-steel hover:text-brand-ice transition-colors">Forgot password?</a>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white font-[510] text-sm rounded-xl p-3 shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                {!isLoading && !isLogin && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

          </div>

          <p className="text-center text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleAuthMode} className="font-medium text-brand-steel hover:text-brand-ice transition-colors">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
