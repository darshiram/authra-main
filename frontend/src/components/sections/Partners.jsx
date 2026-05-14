import React from 'react';
import authraLogo from '../../assets/horziontal logo.png';
import authraIcon from '../../assets/authra.svg';
import authraPng from '../../assets/authra.png';
import authraPfp from '../../assets/authra pfp.png';
import reactIcon from '../../assets/react.svg';
import viteIcon from '../../assets/vite.svg';

export default function Partners() {
  const partners = [
    { name: 'Stripe', logo: authraLogo, description: 'Payment processing infrastructure for the internet.', industry: 'FinTech' },
    { name: 'Linear', logo: authraIcon, description: 'The issue tracking tool you\'ll enjoy using.', industry: 'Productivity' },
    { name: 'Vercel', logo: authraPng, description: 'The platform for frontend developers, providing the speed and reliability innovators need.', industry: 'Cloud Computing' },
    { name: 'Figma', logo: authraPfp, description: 'The collaborative interface design tool for teams.', industry: 'Design' },
    { name: 'Discord', logo: reactIcon, description: 'Voice, video and text chat app that brings people together.', industry: 'Communication' },
    { name: 'Ramp', logo: viteIcon, description: 'The ultimate platform for modern finance teams.', industry: 'Finance' },
  ];

  // Duplicate the array to create a seamless infinite loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="w-full py-10 md:py-14 border-y border-authra-border-light dark:border-authra-border-dark bg-white/30 dark:bg-black/30 backdrop-blur-md relative">
      <div className="max-w-[1200px] mx-auto text-center mb-6 px-6 relative z-0">
        <p className="text-sm font-[510] text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-widest">
          Trusted by innovative enterprises worldwide
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative z-20 w-full flex pt-[180px] pb-4 -mt-[160px] mask-fade-edges">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={index} 
              className="group relative flex-shrink-0 flex items-center justify-center w-[200px] sm:w-[250px] px-4 sm:px-8 cursor-pointer"
            >
              {/* Logo Display */}
              <div className="flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-14 md:h-16 w-auto max-w-full object-contain drop-shadow-sm" 
                  loading="lazy"
                />
              </div>

              {/* Floating Tooltip */}
              <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-50 w-64 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-authra-border-dark rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-[590] text-authra-text-light dark:text-white text-base">{partner.name}</span>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-1 bg-brand-steel/10 text-brand-steel rounded-full">{partner.industry}</span>
                </div>
                <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark text-left leading-relaxed">
                  {partner.description}
                </p>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[8px] border-transparent border-t-white dark:border-t-[#111522]"></div>
                {/* Border layer for the arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[9px] border-transparent border-t-authra-border-light dark:border-t-authra-border-dark -z-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
