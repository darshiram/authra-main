import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Partners from '../components/sections/Partners';
import TrustMetrics from '../components/sections/TrustMetrics';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import HowItWorks from '../components/sections/HowItWorks';
import Testimonials from '../components/sections/Testimonials';
import BottomCTA from '../components/sections/BottomCTA';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Authra | The Standard for Digital Credentials</title>
        <meta name="description" content="Issue, manage, and verify secure digital credentials with our modern, enterprise-grade authentication platform." />
      </Helmet>
      
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* Background Ambient Orbs (Global for Home) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Dark Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#fff_70%,transparent_100%)]" />
          
          <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[25%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute top-[60%] left-[-10%] w-[700px] h-[700px] bg-brand-ice/10 dark:bg-brand-ice/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <Hero />
        <Partners />
        <TrustMetrics />
        <FeaturesGrid />
        <HowItWorks />
        <Testimonials />
        <BottomCTA />
      </main>
    </>
  );
}
