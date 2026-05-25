import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Briefcase, FileText, Globe, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { useGoogleLogin } from '@react-oauth/google';

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

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    college: '',
    website: '',
    github: '',
    linkedin: '',
    skills: '' // comma separated string for simple editing
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          username: res.data.username || '',
          bio: res.data.bio || '',
          location: res.data.location || '',
          college: res.data.college || '',
          website: res.data.website || '',
          github: res.data.github || '',
          linkedin: res.data.linkedin || '',
          skills: res.data.skills ? res.data.skills.join(', ') : ''
        });
      } catch (error) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
    
    // Check for GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const linkGithubCallback = async (code) => {
        try {
          await axiosInstance.post('/auth/link/github', { 
            code,
            redirectUri: window.location.origin + '/settings'
          });
          setUser(prev => ({ ...prev, hasGithubLinked: true }));
          setMessage({ type: 'success', text: 'GitHub account linked successfully!' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to link GitHub account' });
        } finally {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      linkGithubCallback(code);
    }
  }, [navigate]);

  const handleLinkGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await axiosInstance.post('/auth/link/g-login', { 
          token: tokenResponse.access_token,
          tokenResponse: tokenResponse 
        });
        setUser(prev => ({ ...prev, hasGoogleLinked: true }));
        setMessage({ type: 'success', text: 'Google account linked successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to link Google account' });
      }
    },
    onError: (errorResponse) => {
      console.error("Google Link Error:", errorResponse);
      setMessage({ type: 'error', text: "Google link was cancelled or failed. Please try again." });
    }
  });

  const handleLinkGithub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = window.location.origin + '/settings';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      await axiosInstance.put('/users/me', payload);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-authra-bg-light dark:bg-[#0D0F16]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-authra-bg-light dark:bg-[#0D0F16]">
      <div className="max-w-[800px] mx-auto px-4">
        
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">Account Settings</h1>
          <p className="text-authra-text-sec-light dark:text-[#9AA8D6] mt-2">Manage your public profile and personal information.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info Section */}
            <section>
              <h2 className="text-xl font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Username</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-authra-text-sec-light dark:text-[#9AA8D6] text-sm">@</span>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-9 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>

                {user?.accountType !== 'organization' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">University / College</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                      <input type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                    </div>
                  </div>
                )}
                
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all resize-none"></textarea>
                  </div>
                </div>

                {user?.accountType !== 'organization' && (
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Skills (Comma separated)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 px-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                )}
              </div>
            </section>

            <hr className="border-authra-border-light dark:border-[#2A3155]" />

            {/* Links Section */}
            <section>
              <h2 className="text-xl font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-4">Professional Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Personal Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">GitHub Profile</label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">LinkedIn Profile</label>
                  <div className="relative">
                    <LinkedinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6]" />
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="w-full bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2.5 pl-10 pr-4 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                  </div>
                </div>

              </div>
            </section>

            <hr className="border-authra-border-light dark:border-[#2A3155]" />

            {/* Linked Accounts Section */}
            <section>
              <h2 className="text-xl font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-4">Linked Accounts</h2>
              <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mb-4">
                Link your external accounts to use them for signing in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user?.hasGoogleLinked ? (
                  <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-medium rounded-xl py-2.5 px-6 cursor-default">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="currentColor"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                    </svg>
                    Google Connected
                  </div>
                ) : (
                  <button type="button" onClick={() => handleLinkGoogle()} className="flex items-center justify-center gap-2 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] text-authra-text-light dark:text-[#F5F8FF] font-medium rounded-xl py-2.5 px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Link Google
                  </button>
                )}
                
                {user?.hasGithubLinked ? (
                  <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-medium rounded-xl py-2.5 px-6 cursor-default">
                    <GithubIcon className="w-5 h-5" />
                    GitHub Connected
                  </div>
                ) : (
                  <button type="button" onClick={handleLinkGithub} className="flex items-center justify-center gap-2 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] text-authra-text-light dark:text-[#F5F8FF] font-medium rounded-xl py-2.5 px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <GithubIcon className="w-5 h-5" />
                    Link GitHub
                  </button>
                )}
              </div>
            </section>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-ice to-brand-steel text-white px-6 py-2.5 rounded-xl font-[510] text-sm shadow-[0_0_15px_rgba(115,135,197,0.4)] hover:shadow-[0_0_25px_rgba(115,135,197,0.6)] hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
