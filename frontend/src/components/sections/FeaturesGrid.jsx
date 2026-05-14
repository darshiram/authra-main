import React from 'react';
import { ShieldAlert, Fingerprint, LockKeyhole, FileSignature, Brush, Webhook } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Granular RBAC',
      description: 'Define precise roles and permissions. Control who can issue, revoke, or view credentials down to the API level.',
      icon: <LockKeyhole className="w-6 h-6 text-brand-periwinkle" />,
      colSpan: 'md:col-span-2'
    },
    {
      title: 'Immutable Audit Trails',
      description: 'Cryptographically secure logs of every action taken on the platform.',
      icon: <ShieldAlert className="w-6 h-6 text-brand-ice" />,
      colSpan: 'md:col-span-1'
    },
    {
      title: 'Biometric Verification',
      description: 'Require FaceID or TouchID before sensitive actions are executed.',
      icon: <Fingerprint className="w-6 h-6 text-brand-steel" />,
      colSpan: 'md:col-span-1'
    },
    {
      title: 'Custom Branding',
      description: 'Tailor the entire credential experience to your brand. Custom domains, email templates, and certificate designs.',
      icon: <Brush className="w-6 h-6 text-brand-periwinkle" />,
      colSpan: 'md:col-span-2'
    },
    {
      title: 'Instant Issuance',
      description: 'Generate thousands of certificates in seconds with our high-throughput batch engine.',
      icon: <FileSignature className="w-6 h-6 text-brand-ice" />,
      colSpan: 'md:col-span-2'
    },
    {
      title: 'Webhooks & API',
      description: 'Integrate seamlessly with your existing HR or LMS software.',
      icon: <Webhook className="w-6 h-6 text-brand-steel" />,
      colSpan: 'md:col-span-1'
    }
  ];

  return (
    <section className="w-full py-24 relative" id="solutions">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white mb-4">
            Everything you need to scale trust
          </h2>
          <p className="max-w-[600px] mx-auto text-authra-text-sec-light dark:text-authra-text-sec-dark text-lg">
            A comprehensive suite of tools built for enterprise-grade security and developer ergonomics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`card flex flex-col gap-4 group ${feature.colSpan}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-steel/10 dark:bg-brand-steel/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-[590] text-authra-text-light dark:text-white">
                {feature.title}
              </h3>
              <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
