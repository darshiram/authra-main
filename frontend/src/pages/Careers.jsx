import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { axiosInstance } from '../config/api';

export default function Careers() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    portfolioUrl: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axiosInstance.post('/careers/apply', formData);
      setIsSuccess(true);
      setFormData({ fullName: '', email: '', portfolioUrl: '', coverLetter: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>Careers | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-16">
          
          {/* Header */}
          <section className="text-center space-y-6">
            <div className="w-16 h-16 bg-brand-steel/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-brand-steel" />
            </div>
            <h1 className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white tracking-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-steel to-brand-ice">Authra Team</span>
            </h1>
            <p className="text-lg md:text-xl text-authra-text-sec-light dark:text-[#9AA8D6] max-w-2xl mx-auto leading-relaxed">
              Help us build the future of digital trust. We are always looking for passionate engineers, designers, and visionaries.
            </p>
          </section>

          {/* Open Positions */}
          {settings?.jobOpenings?.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-6">Open Positions</h2>
              <div className="grid gap-4">
                {settings.jobOpenings.map((job, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-authra-text-light dark:text-white">{job.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.employmentType}</span>
                      </div>
                    </div>
                    <button onClick={() => {
                        document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
                        setFormData(prev => ({ ...prev, coverLetter: `Applying for ${job.title}\n\n` }));
                      }} className="px-6 py-2 bg-brand-steel/10 text-brand-steel rounded-lg font-medium hover:bg-brand-steel/20 transition-colors">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Application Form */}
          <section id="apply-form" className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-6">Apply Now</h2>
            
            {isSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">Application Submitted!</h3>
                <p className="text-authra-text-sec-light dark:text-[#9AA8D6]">
                  Thank you for your interest in Authra. Our team will review your application and get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-brand-steel hover:text-brand-ice font-medium transition-colors"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Portfolio / Resume Link *</label>
                  <input 
                    type="url" 
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    required
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="https://linkedin.com/in/janedoe or Google Drive link"
                  />
                  <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark mt-1">Please provide a public link to your resume or portfolio.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Cover Letter / Why Authra? *</label>
                  <textarea 
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white resize-none" 
                    placeholder="Tell us why you'd be a great fit for the team..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
