import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageSquare, MapPin, Phone, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/v1/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('http://localhost:5000/api/v1/settings/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', category: 'General Inquiry', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>Contact Us | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-20">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-[590] text-authra-text-light dark:text-white tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-steel to-brand-ice">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-authra-text-sec-light dark:text-[#9AA8D6] max-w-2xl mx-auto leading-relaxed">
              Have questions about Authra or want to integrate our credential verification into your platform? Our team is ready to help.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-8 rounded-[32px] shadow-sm h-full">
                <h3 className="text-2xl font-bold text-authra-text-light dark:text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-steel/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-brand-steel" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-authra-text-light dark:text-white">Email Us</p>
                      <a href={`mailto:${settings?.contactEmail || 'support@authra.com'}`} className="text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel dark:hover:text-brand-ice transition-colors">{settings?.contactEmail || 'support@authra.com'}</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-steel/10 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-brand-steel" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-authra-text-light dark:text-white">Live Chat</p>
                      <p className="text-authra-text-sec-light dark:text-[#9AA8D6]">{settings?.contactLiveChatHours || 'Available Mon-Fri, 9am-5pm EST'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-steel/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-brand-steel" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-authra-text-light dark:text-white">Phone</p>
                      <p className="text-authra-text-sec-light dark:text-[#9AA8D6]">{settings?.contactPhone || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-steel/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-steel" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-authra-text-light dark:text-white">HQ Address</p>
                      <p className="text-authra-text-sec-light dark:text-[#9AA8D6] whitespace-pre-line">{settings?.contactAddress || '123 Trust Avenue,\nSan Francisco, CA 94103'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-8 md:p-12 rounded-[32px] shadow-sm">
                <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-8">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-authra-text-light dark:text-gray-300">Full Name</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-authra-text-light dark:text-gray-300">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-authra-text-light dark:text-gray-300">Category</label>
                    <select 
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white appearance-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="Technical Help">Technical Help</option>
                      <option value="Account Issue">Account Issue</option>
                      <option value="Billing">Billing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-authra-text-light dark:text-gray-300">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-authra-text-light dark:text-gray-300">Message</label>
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-authra-bg-light dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-xl focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'sending' || status === 'success'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-steel hover:bg-brand-steel/90 text-white font-medium rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : status === 'success' ? (
                      'Message Sent Successfully!'
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
