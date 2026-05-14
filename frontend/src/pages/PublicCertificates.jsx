import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PublicNavbar, PublicFooter } from './PublicProfile';

export default function PublicCertificates() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${username}`);
        setUser({
          ...res.data,
          avatar: res.data.name ? res.data.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const allCerts = [
    {
      id: 'AUT-8392-AB',
      title: 'Advanced Full-Stack Engineering',
      issuer: 'TechCorp Academy',
      issueDate: 'May 12, 2026',
      color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'AUT-7714-KL',
      title: 'Cloud Architecture Professional',
      issuer: 'CloudNative Org',
      issueDate: 'January 15, 2026',
      color: 'from-purple-500/10 to-fuchsia-500/10 dark:from-purple-500/20 dark:to-fuchsia-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'AUT-9921-XC',
      title: 'Distributed Systems & Microservices',
      issuer: 'Engineering Labs',
      issueDate: 'Nov 10, 2025',
      color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'AUT-1142-PQ',
      title: 'Data Structures & Algorithms Expert',
      issuer: 'CS Academy',
      issueDate: 'Aug 05, 2025',
      color: 'from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'AUT-4421-MN',
      title: 'Advanced React Patterns',
      issuer: 'Frontend Masters',
      issueDate: 'May 20, 2025',
      color: 'from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      id: 'AUT-2210-YZ',
      title: 'Web Security Principles',
      issuer: 'Security Institute',
      issueDate: 'Jan 12, 2025',
      color: 'from-brand-steel/10 to-brand-ice/10 dark:from-brand-steel/20 dark:to-brand-ice/20',
      borderColor: 'border-brand-steel/30'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-authra-bg-light dark:bg-[#0D0F16]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-steel"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-authra-bg-light dark:bg-[#0D0F16]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-2">User Not Found</h2>
          <p className="text-authra-text-sec-light dark:text-[#9AA8D6]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{user.name || 'User'}'s Certificates | Authra</title>
      </Helmet>

      <PublicNavbar />

      <main className="relative z-10 min-h-screen pt-[120px] pb-20 px-6 font-inter">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#fff_70%,transparent_100%)]" />
          <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[25%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto">

          <div className="mb-10">
            <Link to={`/u/${user.username || user.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel dark:hover:text-brand-ice transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-brand-steel" />
              <h1 className="text-3xl md:text-4xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight">
                All Verified Credentials
              </h1>
            </div>
            <p className="text-authra-text-sec-light dark:text-[#9AA8D6] mt-3">
              Cryptographically verified certificates earned by {user.name || 'User'}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCerts.map((cert) => (
              <div key={cert.id} className="group bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(115,135,197,0.05)] transition-all duration-300 flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${cert.color} relative overflow-hidden flex items-center justify-center border-b ${cert.borderColor}`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                  <div className="w-full max-w-[200px] h-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center shadow-sm relative rotate-2 group-hover:rotate-0 transition-transform duration-500">
                    <div className="w-8 h-8 rounded-full border-2 border-current opacity-30"></div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <div className="w-4 h-1 bg-current opacity-20 rounded-full"></div>
                      <div className="w-2 h-1 bg-current opacity-20 rounded-full"></div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 bg-white dark:bg-black rounded-full p-1.5 shadow-md" title="Cryptographically Verified">
                    <ShieldCheck className="w-4 h-4 text-brand-steel" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-md font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-1 line-clamp-2 group-hover:text-brand-steel transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] mb-6">
                    {cert.issuer}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-authra-border-light dark:border-[#2A3155]">
                    <div className="flex items-center gap-2 text-xs text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-wider font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {cert.issueDate}
                    </div>
                    <button className="text-brand-steel hover:text-brand-ice text-xs font-medium transition-colors">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <PublicFooter />
    </>
  );
}
