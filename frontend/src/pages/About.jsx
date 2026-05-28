import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Zap, Globe, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-brand-steel" />,
      title: "Cryptographic Security",
      description: "Every certificate issued on Authra is mathematically proven and immutable."
    },
    {
      icon: <Globe className="w-6 h-6 text-brand-steel" />,
      title: "Global Verification",
      description: "Anyone can verify credentials instantly from anywhere in the world."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-steel" />,
      title: "Instant Issuance",
      description: "Organizations can issue thousands of certificates in seconds."
    },
    {
      icon: <Lock className="w-6 h-6 text-brand-steel" />,
      title: "Privacy First",
      description: "Users maintain complete control over who sees their credentials."
    }
  ];

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>About Us | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-20">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-[590] text-authra-text-light dark:text-white tracking-tight">
              Reimagining <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-steel to-brand-ice">Digital Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-authra-text-sec-light dark:text-[#9AA8D6] max-w-2xl mx-auto leading-relaxed">
              Authra is on a mission to eliminate credential fraud and streamline verification by providing a secure, blockchain-backed platform for issuing and managing digital certificates.
            </p>
          </section>

          {/* Our Story */}
          <section className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-authra-text-sec-light dark:text-[#9AA8D6] leading-relaxed text-lg">
              <p>
                In a world where digital manipulation is becoming increasingly sophisticated, proving the authenticity of achievements, qualifications, and identities has never been more challenging—or more critical.
              </p>
              <p>
                We built Authra because we believe that trust should be fundamental, not an afterthought. Traditional paper certificates are easily forged and difficult to verify. Existing digital solutions are often siloed, slow, and lack cryptographic proof.
              </p>
              <p>
                By leveraging modern web technologies and decentralized ledgers, Authra empowers educational institutions, corporations, and independent creators to issue credentials that are permanent, verifiable, and entirely secure.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section>
            <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-8 text-center">Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-6 rounded-[24px] hover:border-brand-steel/50 transition-colors group">
                  <div className="w-12 h-12 bg-brand-steel/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-authra-text-light dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-authra-text-sec-light dark:text-[#9AA8D6] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-brand-steel/5 dark:bg-brand-steel/10 border border-brand-steel/20 rounded-[32px] p-12">
            <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-4">Join the Trust Revolution</h2>
            <p className="text-authra-text-sec-light dark:text-[#9AA8D6] mb-8 max-w-lg mx-auto">
              Start issuing secure, verifiable credentials for your organization today.
            </p>
            <a href="/signup" className="btn-primary inline-flex">
              Get Started for Free
            </a>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
