import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Check, Code, Briefcase, 
  ChevronRight, Building2, MapPin, Loader2, Sparkles 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import horizontalLogo from '../assets/horziontal logo.png';
import { axiosInstance } from '../config/api';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.5-3.78A4.9 4.9 0 0 0 18 2.5s-1.2-.4-3.9 1.5a13.3 13.3 0 0 0-7 0C4.3 2.1 3 2.5 3 2.5a4.9 4.9 0 0 0 .1 5.72A5.2 5.2 0 0 0 1.5 12c0 5.23 3 6.42 6 6.76A4.8 4.8 0 0 0 6.5 22v4"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// Data
const interests = ['AI/ML', 'Cybersecurity', 'Full Stack', 'Data Science', 'UI/UX', 'DevOps', 'Cloud', 'Robotics', 'Blockchain'];
const careerGoals = [
  { id: 'intern', title: 'Internships', desc: 'Find early career opportunities' },
  { id: 'placement', title: 'Placements', desc: 'Full-time roles after graduation' },
  { id: 'freelance', title: 'Freelancing', desc: 'Short-term and contract work' },
  { id: 'startup', title: 'Startup', desc: 'Join or build an early stage company' },
  { id: 'research', title: 'Research', desc: 'Academic or corporate R&D' },
  { id: 'network', title: 'Networking', desc: 'Connect with industry professionals' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: location.state?.fullName || '',
    username: '',
    college: '',
    degree: '',
    branch: '',
    year: '',
    selectedInterests: [],
    selectedGoals: [],
    github: '',
    linkedin: '',
    portfolio: '',
    preferences: { alerts: true, workshops: true, personalized: true, updates: false }
  });

  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const finishOnboarding = async () => {
    setIsLoading(true);
    
    try {
      const email = location.state?.email;
      const password = location.state?.password;
      const googleToken = location.state?.googleToken;
      const githubToken = location.state?.githubToken;
      const accountType = location.state?.accountType || 'user';
      
      if (!email) {
        navigate('/signup');
        return;
      }

      const payload = {
        accountType,
        email,
        ...formData
      };

      if (googleToken) payload.googleToken = googleToken;
      else if (githubToken) payload.githubToken = githubToken;
      else payload.password = password;

      const res = await axiosInstance.post('/auth/register', payload);
      navigate(`/user/${res.data.username || formData.username}`);
    } catch (err) {
      console.error(err);
      alert('Registration failed. ' + (err.response?.data?.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goalId)
        ? prev.selectedGoals.filter(i => i !== goalId)
        : [...prev.selectedGoals, goalId]
    }));
  };

  const togglePref = (key) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: !prev.preferences[key] }
    }));
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 30 : -30, opacity: 0 })
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                  placeholder="e.g. Jane Doe" 
                  className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 px-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:ring-1 focus:ring-brand-steel focus:border-brand-steel outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">Username</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-authra-text-sec-light dark:text-[#9AA8D6] text-sm pointer-events-none">authra.in/u/</span>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => updateForm('username', e.target.value)}
                    placeholder="janedoe" 
                    className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-3 pl-[90px] pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:ring-1 focus:ring-brand-steel focus:border-brand-steel outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-[#9AA8D6] mt-2">This will be your public profile URL.</p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">College / University</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8D6]" />
                <input type="text" value={formData.college} onChange={(e) => updateForm('college', e.target.value)} placeholder="e.g. Stanford University" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">Degree</label>
                <input type="text" value={formData.degree} onChange={(e) => updateForm('degree', e.target.value)} placeholder="e.g. B.Tech" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 px-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">Branch</label>
                <input type="text" value={formData.branch} onChange={(e) => updateForm('branch', e.target.value)} placeholder="e.g. CS" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 px-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1.5">Graduation Year</label>
              <select value={formData.year} onChange={(e) => updateForm('year', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 px-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF] appearance-none">
                <option value="">Select Year</option>
                {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-wrap gap-3">
            {interests.map(interest => {
              const isSelected = formData.selectedInterests.includes(interest);
              return (
                <motion.button
                  key={interest}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-brand-steel text-white border-transparent shadow-[0_0_15px_rgba(95,110,183,0.3)]' : 'bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:border-brand-steel/50'}`}
                >
                  {interest}
                </motion.button>
              )
            })}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careerGoals.map(goal => {
              const isSelected = formData.selectedGoals.includes(goal.id);
              return (
                <motion.button
                  key={goal.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${isSelected ? 'bg-brand-steel/10 border-brand-steel dark:bg-brand-steel/20' : 'bg-white dark:bg-[#111522] border-authra-border-light dark:border-[#2A3155] hover:border-brand-steel/50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium ${isSelected ? 'text-brand-steel dark:text-[#A8D3E8]' : 'text-authra-text-light dark:text-[#F5F8FF]'}`}>{goal.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-steel dark:text-brand-ice" />}
                  </div>
                  <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6] mt-1">{goal.desc}</p>
                </motion.button>
              )
            })}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="relative">
              <GithubIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8D6]" />
              <input type="url" value={formData.github} onChange={(e) => updateForm('github', e.target.value)} placeholder="GitHub URL" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
            </div>
            <div className="relative">
              <LinkedinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8D6]" />
              <input type="url" value={formData.linkedin} onChange={(e) => updateForm('linkedin', e.target.value)} placeholder="LinkedIn URL" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8D6]" />
              <input type="url" value={formData.portfolio} onChange={(e) => updateForm('portfolio', e.target.value)} placeholder="Personal Portfolio URL" className="w-full bg-white dark:bg-[#111522] border border-[#2A3155] rounded-xl py-3 pl-11 pr-4 text-sm focus:border-brand-steel outline-none text-[#F5F8FF]" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            {[
              { id: 'alerts', label: 'Internship & Job Alerts' },
              { id: 'workshops', label: 'Workshop & Event Updates' },
              { id: 'personalized', label: 'Personalized Recommendations' },
              { id: 'updates', label: 'Product & Feature Updates' },
            ].map(pref => (
              <label key={pref.id} className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${formData.preferences[pref.id] ? 'bg-brand-steel border-brand-steel' : 'bg-transparent border-[#2A3155] group-hover:border-brand-steel'}`}>
                  {formData.preferences[pref.id] && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={formData.preferences[pref.id]} onChange={() => togglePref(pref.id)} />
                <span className="text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] select-none">{pref.label}</span>
              </label>
            ))}
            <div className="pt-4 mt-6 border-t border-authra-border-light dark:border-[#2A3155]">
              <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6]">
                By completing setup, you agree to our Terms of Service. We only use your preferences to personalize opportunities and recommendations.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Let's get to know you";
      case 2: return "Academic background";
      case 3: return "What are you interested in?";
      case 4: return "What are your career goals?";
      case 5: return "Link your professional profiles";
      case 6: return "Preferences & Consent";
      default: return "";
    }
  };

  const getStepDesc = () => {
    switch(step) {
      case 1: return "Your basic information for your public profile.";
      case 2: return "Helps us match you with the right opportunities.";
      case 3: return "Select at least a few topics you're passionate about.";
      case 4: return "What are you looking to achieve next?";
      case 5: return "Connect your digital presence (Optional).";
      case 6: return "Control how we communicate with you.";
      default: return "";
    }
  };

  if (step === 7) {
    return (
      <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] flex items-center justify-center p-6 font-inter relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-steel/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-white/80 dark:bg-[#111522]/80 backdrop-blur-xl border border-authra-border-light dark:border-[#2A3155] rounded-[32px] p-10 max-w-sm w-full text-center relative z-10 shadow-2xl"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-[#A8D3E8] to-[#5F6EB7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(115,135,197,0.4)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-[590] text-authra-text-light dark:text-[#F5F8FF] mb-2">You're all set!</h1>
          <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mb-8">
            Your profile has been created successfully. Welcome to Authra.
          </p>
          <button 
            onClick={() => navigate('/user/profile')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white font-[510] shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            Go to Profile <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] flex flex-col font-inter">
      {/* Top Bar */}
      <div className="w-full p-6 flex justify-between items-center relative z-20">
        <a href="/">
          <img src={horizontalLogo} alt="Authra" className="h-6 w-auto object-contain" />
        </a>
        <div className="text-sm font-medium text-authra-text-sec-light dark:text-[#9AA8D6]">
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-authra-border-light dark:bg-[#2A3155] fixed top-0 left-0 z-30">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#A8D3E8] to-[#5F6EB7]"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-32 md:pb-6 relative z-10">
        <div className="w-full max-w-[480px]">
          
          <div className="mb-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h1 className="text-2xl sm:text-3xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight mb-2">
                  {getStepTitle()}
                </h1>
                <p className="text-authra-text-sec-light dark:text-[#9AA8D6] text-sm">
                  {getStepDesc()}
                </p>
                
                <div className="mt-8">
                  {renderStep()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Bottom Sticky CTA for Mobile (Also works for Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 dark:bg-[#0D0F16]/80 backdrop-blur-xl border-t border-authra-border-light dark:border-[#2A3155] z-30 md:static md:bg-transparent md:border-transparent md:backdrop-blur-none">
        <div className="max-w-[480px] mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={prevStep}
            className={`p-3.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all ${step === 1 ? 'invisible' : 'visible'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={nextStep}
            disabled={isLoading}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white font-[510] shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === totalSteps ? 'Complete Setup' : 'Continue'}
                {step !== totalSteps && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
