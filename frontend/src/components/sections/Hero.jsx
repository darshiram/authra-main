import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import heroImg from '../../assets/hero.png';

export default function Hero() {
  return (
    <section className="relative w-full max-w-[1200px] mx-auto px-6 pt-[140px] pb-20 md:pt-[200px] md:pb-32 flex flex-col items-center text-center">
      {/* V2.0 Badge */}
      <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-authra-border-light dark:border-brand-steel/30 bg-white/50 dark:bg-[#0D0F16]/50 backdrop-blur-md shadow-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-ice opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-periwinkle"></span>
        </span>
        <span className="text-sm font-[510] text-authra-text-sec-light dark:text-authra-text-sec-dark tracking-wide">
          Authra v2.0 is live
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="animate-fade-up delay-1 max-w-[900px] text-5xl md:text-7xl lg:text-[80px] font-[590] tracking-[-0.02em] leading-[1.05] mb-8 text-authra-text-light dark:text-white">
        The standard for <br className="hidden md:block" />
        <span className="gradient-text">digital credentials</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-2 max-w-[650px] text-lg md:text-xl text-authra-text-sec-light dark:text-authra-text-sec-dark mb-10 leading-relaxed">
        Issue, manage, and verify secure digital certificates at scale. Designed for enterprise security with a beautiful, modern experience.
      </p>

      {/* CTAs */}
      <div className="animate-fade-up delay-3 flex flex-col sm:flex-row gap-5 items-center justify-center w-full md:w-auto mb-20">
        <a href="#signup" className="w-full sm:w-fit btn-primary group flex items-center justify-center">
          Start Issuing Free
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a href="#demo" className="w-full sm:w-fit btn-secondary flex items-center justify-center">
          Book a Demo
        </a>
      </div>

      {/* Floating Hero Image */}
      <div className="animate-fade-up delay-3 relative w-full max-w-[1000px] mx-auto rounded-[24px] p-2 bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-authra-bg-light dark:to-authra-bg-dark rounded-[24px] pointer-events-none z-10" style={{ top: '60%' }}></div>
        <img 
          src={heroImg} 
          alt="Authra Dashboard Preview" 
          className="w-full h-auto rounded-[20px] shadow-[var(--shadow-btn)] border border-authra-border-light dark:border-authra-border-dark dark:shadow-[var(--shadow-btn-dark)] object-cover relative z-0" 
        />
        
        {/* Decorative Floating Element */}
        <div className="absolute -top-6 -right-6 hidden lg:flex items-center gap-3 px-5 py-4 bg-white/90 dark:bg-[#0D0F16]/90 backdrop-blur-md border border-authra-border-light dark:border-authra-border-dark shadow-xl rounded-2xl animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ice/20 text-brand-steel">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-[590] text-authra-text-light dark:text-white">Verified Secure</span>
            <span className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">Cryptographically signed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
