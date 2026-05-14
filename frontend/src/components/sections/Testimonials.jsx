import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Authra completely revolutionized how we handle internal certifications. The API was a breeze to integrate, and the audit trails give our compliance team peace of mind.",
      author: "Sarah Jenkins",
      role: "CTO, TechFlow Solutions"
    },
    {
      quote: "We scaled from issuing 100 certificates a month to over 50,000. Authra's batch engine didn't break a sweat. The platform is incredibly robust and beautifully designed.",
      author: "Marcus Chen",
      role: "VP Engineering, LearnPath"
    },
    {
      quote: "The granular RBAC allows us to delegate issuance to department heads without compromising our global security posture. It's the standard for a reason.",
      author: "Elena Rodriguez",
      role: "Head of Security, NexusCorp"
    }
  ];

  return (
    <section className="w-full py-32 relative overflow-hidden">
      {/* Background glow for testimonials */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-brand-periwinkle/5 dark:bg-brand-periwinkle/10 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white mb-4">
            Trusted by Engineering Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="card relative flex flex-col justify-between group bg-white/60 dark:bg-[#0D0F16]/60 backdrop-blur-xl">
              <Quote className="absolute top-8 right-8 w-8 h-8 text-brand-steel/20 dark:text-brand-steel/30 group-hover:text-brand-periwinkle transition-colors" />
              <p className="text-lg text-authra-text-light dark:text-white mb-10 leading-relaxed font-[400]">
                "{review.quote}"
              </p>
              <div className="flex flex-col">
                <span className="font-[590] text-authra-text-light dark:text-brand-ice">{review.author}</span>
                <span className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark">{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
