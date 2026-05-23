import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Globe, Mail, ArrowLeft, MapPin, Award } from 'lucide-react';
import { axiosInstance } from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.5-3.78A4.9 4.9 0 0 0 18 2.5s-1.2-.4-3.9 1.5a13.3 13.3 0 0 0-7 0C4.3 2.1 3 2.5 3 2.5a4.9 4.9 0 0 0 .1 5.72A5.2 5.2 0 0 0 1.5 12c0 5.23 3 6.42 6 6.76A4.8 4.8 0 0 0 6.5 22v4"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function OrgProfile() {
  const { username } = useParams();
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/users/${username}`);
        if (res.data.accountType !== 'organization') {
          setError('This profile does not belong to an organization.');
        } else {
          setOrg(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Organization not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrg();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090b11] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090b11] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl md:text-6xl font-[590] text-authra-text-light dark:text-white mb-4 tracking-tight">Organization Not Found</h1>
        <p className="text-authra-text-sec-light dark:text-[#9AA8D6] mb-8 text-center">{error}</p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0D0F16] font-inter">
      <Helmet>
        <title>{org.name || 'Organization Profile'} | Authra</title>
      </Helmet>



      <main className="relative z-10 min-h-screen pt-24 pb-20">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#fff_70%,transparent_100%)]" />
          <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[25%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        {/* Cover / Header Section */}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="relative mb-16">
            {/* Banner Background */}
            <div className="rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-steel/20 to-brand-ice/20 h-48 md:h-64 border border-authra-border-light dark:border-authra-border-dark relative">
              <div className="absolute inset-0 backdrop-blur-[2px]"></div>
            </div>

            {/* Logo Avatar overlapping cover */}
            <div className="absolute -bottom-12 left-8 md:left-12">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-[#111522] border-4 border-[#f8fafc] dark:border-[#090b11] shadow-xl overflow-hidden flex items-center justify-center p-1">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-brand-steel to-brand-ice flex items-center justify-center text-white text-3xl md:text-5xl font-bold overflow-hidden">
                  {org.logoUrl || org.profilePicture ? (
                    <img src={org.logoUrl || org.profilePicture} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    org.name ? org.name.substring(0, 2).toUpperCase() : 'O'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Org Info */}
          <div className="px-2 md:px-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-authra-text-light dark:text-white mb-2 tracking-tight">
                  {org.name || 'Organization Name'}
                </h1>
                {org.username && <p className="text-brand-steel font-medium mb-4">@{org.username}</p>}

                <div className="flex flex-wrap items-center gap-4 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark">
                  {org.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {org.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Verified Issuer
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-3 flex-wrap">
                {org.website && org.website !== '#' && org.website !== '' && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {org.linkedin && org.linkedin !== '#' && org.linkedin !== '' && (
                  <a href={org.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-[#0077b5] dark:hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-colors">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
                {org.github && org.github !== '#' && org.github !== '' && (
                  <a href={org.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}
                <a href={`mailto:${org.email}`} className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (About) */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                {org.aboutOrg && (
                  <section className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-authra-text-light dark:text-white mb-4">About Organization</h2>
                    <p className="text-authra-text-sec-light dark:text-[#9AA8D6] leading-relaxed whitespace-pre-wrap">
                      {org.aboutOrg}
                    </p>
                  </section>
                )}

                {/* Gallery Section */}
                {org.gallery && org.gallery.filter(url => url && url.trim() !== '').length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-authra-text-light dark:text-white mb-6">Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {org.gallery.filter(url => url && url.trim() !== '').map((url, idx) => (
                        <div key={idx} className="group relative aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-authra-border-light dark:border-authra-border-dark">
                          <img
                            src={url}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(!org.aboutOrg && (!org.gallery || org.gallery.filter(url => url && url.trim() !== '').length === 0)) && (
                  <div className="bg-white dark:bg-[#0D0F16] border border-dashed border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <Globe className="w-8 h-8 text-authra-text-sec-light dark:text-authra-text-sec-dark opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-authra-text-light dark:text-white mb-2">Profile Under Construction</h3>
                    <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark max-w-sm mx-auto">
                      {org.name} hasn't added an about section or gallery images yet. Check back soon for updates!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-authra-text-light dark:text-white uppercase tracking-wider mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    {org.mobileNo && (
                      <div>
                        <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium mb-1">Phone</p>
                        <p className="text-sm font-medium text-authra-text-light dark:text-white">{org.mobileNo}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium mb-1">Email Address</p>
                      <p className="text-sm font-medium text-authra-text-light dark:text-white">{org.email}</p>
                    </div>
                    {org.website && (
                      <div>
                        <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium mb-1">Website</p>
                        <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
                          {(() => {
                            try {
                              return new URL(org.website).hostname.replace('www.', '');
                            } catch {
                              return org.website;
                            }
                          })()}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
