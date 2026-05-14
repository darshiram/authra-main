import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BottomCTA() {
  return (
    <section className="w-full py-24 relative" id="pricing">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="relative rounded-[32px] overflow-hidden bg-[#111522] dark:bg-black border border-authra-border-dark p-12 md:p-20 text-center shadow-2xl">
          {/* Internal Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-brand-steel/30 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-brand-periwinkle/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-[590] text-white mb-6">
              Ready to secure your credentials?
            </h2>
            <p className="text-authra-text-sec-dark text-lg md:text-xl max-w-[600px] mx-auto mb-10">
              Join thousands of enterprises already using Authra to issue and verify digital certificates at scale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full sm:w-auto">
              <a href="#signup" className="w-full sm:w-auto btn-primary group">
                Create Free Account
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#contact" className="w-full sm:w-auto px-7 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl font-[510] text-base hover:bg-white/10 transition-all duration-200">
                Contact Sales
              </a>
            </div>
            <p className="mt-6 text-sm text-authra-text-sec-dark font-mono">
              No credit card required • 14-day free trial for Enterprise
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
