import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/v1/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      }
    };
    fetchSettings();
  }, []);

  // Use a fallback if the fetch fails
  const policyContent = settings?.privacyPolicyText?.length > 0 ? settings.privacyPolicyText : [
    { title: "1. Information We Collect", content: "We collect information you provide directly to us..." }
  ];

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>Privacy Policy | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
          
          {/* Header */}
          <section className="text-center space-y-6">
            <div className="w-16 h-16 bg-brand-steel/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-brand-steel" />
            </div>
            <h1 className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-authra-text-sec-light dark:text-[#9AA8D6] max-w-2xl mx-auto leading-relaxed">
              We care about your data. Learn how we collect, use, and protect your personal information.
            </p>
          </section>

          {/* Content */}
          <section className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-[32px] p-8 md:p-12 shadow-sm space-y-8 text-authra-text-light dark:text-authra-text-sec-dark leading-relaxed">
            
            {policyContent.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-4">{section.title}</h2>
                <p className="whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
