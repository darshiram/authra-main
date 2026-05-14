import React from 'react';

export default function TrustMetrics() {
  const metrics = [
    { value: '1M+', label: 'Credentials Issued' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '500+', label: 'Enterprise Clients' },
    { value: '<50ms', label: 'Verification Speed' },
  ];

  return (
    <section className="w-full py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-[590] text-authra-text-light dark:text-white mb-2 gradient-text">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-authra-text-sec-light dark:text-authra-text-sec-dark font-[510]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
