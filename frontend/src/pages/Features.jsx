import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Zap, Share2, Layers, CheckCircle2, Lock, FileText, Database } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-brand-steel" />,
      title: "Cryptographic Verification",
      description: "Every credential issued on Authra is secured using advanced cryptographic signatures, making forgery mathematically impossible and ensuring absolute trust."
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-steel" />,
      title: "Lightning-Fast Issuance",
      description: "Issue certificates in seconds. Our optimized infrastructure allows organizations to distribute thousands of credentials globally with zero latency."
    },
    {
      icon: <Layers className="w-8 h-8 text-brand-steel" />,
      title: "Bulk Operations",
      description: "Upload a simple CSV file to issue credentials to an entire cohort, bootcamp class, or conference at once. Authra handles the heavy lifting."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-brand-steel" />,
      title: "Custom Branded Templates",
      description: "Design credentials that reflect your organization's identity. Choose from our modern templates or create your own custom glassmorphic designs."
    },
    {
      icon: <Share2 className="w-8 h-8 text-brand-steel" />,
      title: "1-Click Sharing",
      description: "Users can instantly share their verified credentials to LinkedIn, X (Twitter), or embed them directly on their personal portfolios."
    },
    {
      icon: <Database className="w-8 h-8 text-brand-steel" />,
      title: "Smart Portfolios",
      description: "Authra provides every user with a beautifully designed public profile to showcase their verified skills, projects, and achievements in one place."
    },
    {
      icon: <Lock className="w-8 h-8 text-brand-steel" />,
      title: "Privacy Controls",
      description: "Granular privacy settings put the user in complete control. Hide or show specific credentials, and manage exactly what the public can see."
    },
    {
      icon: <FileText className="w-8 h-8 text-brand-steel" />,
      title: "Automated Workflows",
      description: "Integrate Authra into your existing LMS or HR software via our API to completely automate your credential issuance process."
    }
  ];

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>Features | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[40%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-[590] text-authra-text-light dark:text-white tracking-tight">
              Powerful Features for a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-steel to-brand-ice">Trustless World</span>
            </h1>
            <p className="text-lg md:text-xl text-authra-text-sec-light dark:text-[#9AA8D6] max-w-2xl mx-auto leading-relaxed">
              Authra equips organizations and individuals with everything they need to issue, manage, and verify digital credentials securely.
            </p>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-8 rounded-[32px] hover:border-brand-steel/50 transition-colors group">
                <div className="w-16 h-16 bg-brand-steel/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-authra-text-light dark:text-white mb-4">{feature.title}</h3>
                <p className="text-authra-text-sec-light dark:text-[#9AA8D6] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </section>

          {/* Verification Showcase */}
          <section className="bg-brand-steel/5 dark:bg-[#111522] border border-brand-steel/20 dark:border-[#2A3155] rounded-[40px] overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="p-10 lg:p-16 lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-steel/10 text-brand-steel text-sm font-medium">
                <Shield className="w-4 h-4" /> Instant Verification
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-authra-text-light dark:text-white">
                Verify Credentials in Milliseconds
              </h2>
              <p className="text-authra-text-sec-light dark:text-[#9AA8D6] leading-relaxed text-lg">
                No more background checks or calling universities. Employers can scan a QR code or click a link to instantly verify the cryptographic signature of any credential issued on Authra. 
              </p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-center gap-3 text-authra-text-light dark:text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Tamper-proof metadata
                </li>
                <li className="flex items-center gap-3 text-authra-text-light dark:text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Independent cryptographic proof
                </li>
                <li className="flex items-center gap-3 text-authra-text-light dark:text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Real-time revocation checking
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full h-full min-h-[400px] bg-gradient-to-tr from-brand-steel/20 to-brand-ice/20 relative p-8 flex items-center justify-center">
              {/* Mock Certificate UI */}
              <div className="w-full max-w-sm bg-white dark:bg-[#0D0F16] rounded-2xl shadow-2xl border border-authra-border-light dark:border-[#2A3155] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-brand-steel/20 rounded-full"></div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-authra-border-light dark:bg-white/10 rounded"></div>
                  <div className="h-3 w-1/2 bg-authra-border-light dark:bg-white/10 rounded"></div>
                </div>
                <div className="pt-4 border-t border-authra-border-light dark:border-[#2A3155]">
                  <div className="h-2 w-full bg-authra-border-light dark:bg-white/5 rounded mb-2"></div>
                  <div className="h-2 w-4/5 bg-authra-border-light dark:bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-authra-text-light dark:text-white mb-6">Ready to upgrade your credentialing?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/signup" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                Get Started Now
              </a>
              <a href="/pricing" className="px-8 py-4 text-lg font-medium text-authra-text-light dark:text-white border border-authra-border-light dark:border-[#2A3155] rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full sm:w-auto">
                View Pricing
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
