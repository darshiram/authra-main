import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Design your credential',
      description: 'Use our drag-and-drop builder to create a beautiful, on-brand certificate template in minutes.',
    },
    {
      step: '02',
      title: 'Connect your data',
      description: 'Upload a CSV or connect via API to map recipient data to your credential template.',
    },
    {
      step: '03',
      title: 'Issue & Verify',
      description: 'Send secure, verifiable digital credentials directly to recipients with 1-click LinkedIn integration.',
    }
  ];

  return (
    <section className="w-full py-24 relative bg-authra-surface-light/50 dark:bg-[#0D0F16]/50 backdrop-blur-sm border-y border-authra-border-light dark:border-authra-border-dark" id="developers">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white mb-4">
            How it works
          </h2>
          <p className="max-w-[600px] mx-auto text-authra-text-sec-light dark:text-authra-text-sec-dark text-lg">
            From design to issuance in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-steel to-transparent border-t border-dashed border-brand-steel/50"></div>
              )}
              
              <div className="w-20 h-20 rounded-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-authra-border-dark shadow-xl flex items-center justify-center text-2xl font-[590] text-brand-periwinkle dark:text-brand-ice mb-8 relative z-10">
                {item.step}
              </div>
              <h3 className="text-2xl font-[590] text-authra-text-light dark:text-white mb-4">
                {item.title}
              </h3>
              <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
