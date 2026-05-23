import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { 
  Mail, MapPin, Briefcase, Award, ShieldCheck, 
  Calendar, ExternalLink, Code, FileBadge, Globe, Terminal, Activity,
  Sun, Moon, ArrowRight, Folder
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import horizontalLogo from '../assets/horziontal logo.png';
import DownloadOffscreenButton from '../components/DownloadOffscreenButton';

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

export const PublicNavbar = () => {
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pt-8">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex items-center justify-between">
          <a href="/">
            <img src={horizontalLogo} alt="Authra" className="h-7 w-auto object-contain cursor-pointer transition-opacity hover:opacity-80" />
          </a>
          <button onClick={toggleTheme} className="p-2 rounded-full text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const PublicFooter = () => (
  <footer className="mt-20 py-16 border-t border-authra-border-light dark:border-[#2A3155] bg-white/30 dark:bg-[#0D0F16]/30">
    <div className="max-w-[1100px] mx-auto px-6 flex flex-col items-center text-center">
      <a href="/">
        <img src={horizontalLogo} alt="Authra" className="h-6 w-auto object-contain mb-5 opacity-80 hover:opacity-100 transition-opacity" />
      </a>
      <p className="text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] mb-1">
        Build a modern public developer profile.
      </p>
      <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mb-8">
        Showcase projects, coding stats, and achievements.
      </p>
      <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6]">
        &copy; 2026 Authra
      </p>
    </div>
  </footer>
);

export default function PublicProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [githubData, setGithubData] = useState(null);
  const [platformCerts, setPlatformCerts] = useState([]);

  useEffect(() => {
    const fetchGithubStats = async (githubUrl) => {
      if (!githubUrl || githubUrl === '#') return;
      let ghUsername = githubUrl;
      if (ghUsername.includes('github.com/')) {
        ghUsername = ghUsername.split('github.com/')[1].split('/')[0];
      }
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${ghUsername}?y=last`);
        const data = await res.json();
        setGithubData(data);
      } catch (err) {
        console.error("Failed to fetch github stats", err);
      }
    };

    if (user && user.links?.github) {
      fetchGithubStats(user.links.github);
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${username}`);
        setUser({
          ...res.data,
          avatar: res.data.name ? res.data.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U',
          location: res.data.location || 'Remote',
          skills: res.data.skills?.length > 0 ? res.data.skills : ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
          links: {
            linkedin: res.data.linkedin || '#',
            github: res.data.github || '#',
            portfolio: res.data.website || '#'
          }
        });

        // Fetch platform certificates
        try {
          const resCerts = await axiosInstance.get(`/certificates/user/${username}`);
          setPlatformCerts(resCerts.data);
        } catch (certErr) {
          console.error("Failed to fetch platform certificates", certErr);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  let githubScore = '0 Commits';
  if (githubData && githubData.total) {
    const totalGithubContributions = Object.keys(githubData.total)
      .filter(key => key !== 'lastYear' && !isNaN(Number(key)))
      .reduce((sum, key) => sum + githubData.total[key], 0);
    
    githubScore = `${totalGithubContributions.toLocaleString()} Commits`;
  } else if (githubData && githubData.error) {
    githubScore = 'Not Found';
  } else if (user?.links?.github && user.links.github !== '#') {
    githubScore = 'Loading...';
  } else {
    githubScore = 'Top 5%'; // Fallback if no github link
  }

  const codingProfiles = [
    { name: 'GitHub', score: githubScore, link: user?.links?.github && user.links.github !== '#' ? user.links.github : '#', icon: GithubIcon },
    { name: 'StackOverflow', score: '1,204 Rep', link: '#', icon: Terminal },
    { name: 'LeetCode', score: 'Knight', link: '#', icon: Code },
    { name: 'Kaggle', score: 'Expert', link: '#', icon: Activity }
  ];
  
  const authraCerts = platformCerts.map((cert) => ({
    id: cert.credentialId,
    title: cert.eventName || 'Certificate of Completion',
    issuer: cert.issuerId?.name || 'Authra Issuer',
    issueDate: new Date(cert.issueDate).toLocaleDateString(),
    skills: cert.additionalDetails?.skills ? cert.additionalDetails.skills.split(',').map(s=>s.trim()) : [],
    verified: true,
    color: cert.templateId === 'cyberpunk' ? 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20' : 
           cert.templateId === 'executive' ? 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20' :
           'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    borderColor: cert.templateId === 'cyberpunk' ? 'border-cyan-500/30' : 
                 cert.templateId === 'executive' ? 'border-blue-500/30' : 'border-emerald-500/30',
    templateId: cert.templateId
  }));
  
  const externalCerts = user?.certificates || [];

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
        <title>{user.name || 'User'} | Professional Profile</title>
      </Helmet>

      <PublicNavbar />

      <main className="relative z-10 min-h-screen pt-[120px] pb-10 px-6 font-inter">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#fff_70%,transparent_100%)]" />
          <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[25%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Identity & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Identity Card */}
            <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-8 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#A8D3E8] to-[#5F6EB7] flex items-center justify-center text-3xl font-bold text-white shadow-[0_4px_15px_rgba(115,135,197,0.25)] mb-6 overflow-hidden">
                {(user.profilePicture || user.logoUrl) ? (
                  <img src={user.profilePicture || user.logoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.avatar
                )}
              </div>
              <h1 className="text-2xl font-[590] text-authra-text-light dark:text-[#F5F8FF] tracking-tight mb-1">
                {user.name || 'User'}
              </h1>
              <p className="text-brand-steel font-medium mb-4">@{user.username || user.email?.split('@')[0] || 'user'}</p>
              
              <div className="space-y-3 text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mb-6">
                {user.role && user.role !== 'User' && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.role}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <a href="#" className="hover:text-brand-ice transition-colors">Contact Me</a>
                </div>
              </div>

              <p className="text-sm text-authra-text-light dark:text-[#F5F8FF] leading-relaxed mb-6">
                {user.bio}
              </p>

              <div className="flex flex-wrap gap-3">
                <a href={user.links.github} className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href={user.links.linkedin} className="p-2.5 rounded-xl border border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-[#0077b5] dark:hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7387C5] to-[#5F6EB7] text-white text-sm font-[510] shadow-[0_4px_15px_rgba(115,135,197,0.25)] hover:brightness-110 transition-all">
                  Hire Me
                </button>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-8 shadow-sm">
              <h3 className="text-sm font-[590] text-authra-text-light dark:text-[#F5F8FF] uppercase tracking-wider mb-5">Top Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-authra-bg-light dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Activity & Certificates */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Coding Profiles & Activity */}
            <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-5 h-5 text-brand-steel" />
                <h2 className="text-xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">Developer Profiles</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {codingProfiles.map((profile, i) => {
                  const isNotSet = profile.link === '#';
                  return (
                    <div key={i} className="relative overflow-hidden rounded-xl border border-authra-border-light dark:border-[#2A3155] bg-white dark:bg-[#111522]">
                      {isNotSet && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-[#111522]/40 backdrop-blur-[2px]">
                          <span className="font-semibold text-xs text-authra-text-sec-light dark:text-[#F5F8FF] px-3 py-1 bg-white/90 dark:bg-black/60 rounded-full shadow-sm border border-authra-border-light dark:border-white/10">
                            {profile.name} Not Set
                          </span>
                        </div>
                      )}
                      <a href={profile.link} className={`group flex items-center p-4 h-full ${isNotSet ? 'pointer-events-none blur-[2px] opacity-60' : 'hover:border-brand-steel transition-colors'}`}>
                        <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-authra-text-light dark:text-[#F5F8FF] mr-4 group-hover:scale-110 transition-transform">
                          <profile.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-authra-text-light dark:text-[#F5F8FF]">{profile.name}</h4>
                          <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6]">{profile.score}</p>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* GitHub Activity Mockup */}
              <div className="w-full">
                <h3 className="text-sm font-[590] text-authra-text-light dark:text-[#F5F8FF] uppercase tracking-wider mb-4">GitHub Contributions</h3>
                <div className="w-full h-32 rounded-xl bg-authra-bg-light dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] p-4 flex flex-col justify-between relative overflow-hidden">
                  {!user.github && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-[#111522]/40 backdrop-blur-[3px]">
                      <span className="font-semibold text-sm text-authra-text-sec-light dark:text-[#F5F8FF] px-4 py-1.5 bg-white/90 dark:bg-black/60 rounded-full shadow-sm border border-authra-border-light dark:border-white/10">
                        GitHub Not Set
                      </span>
                    </div>
                  )}
                  <div className={`flex gap-1 overflow-hidden opacity-80 ${!user.github ? 'blur-[2px]' : ''}`}>
                    {githubData && githubData.contributions ? (() => {
                      const weeks = [];
                      let currentWeek = [];
                      const firstDay = new Date(githubData.contributions[0].date).getDay();
                      for (let i = 0; i < firstDay; i++) {
                        currentWeek.push(null);
                      }
                      githubData.contributions.forEach(day => {
                        currentWeek.push(day);
                        if (currentWeek.length === 7) {
                          weeks.push(currentWeek);
                          currentWeek = [];
                        }
                      });
                      if (currentWeek.length > 0) {
                        while (currentWeek.length < 7) currentWeek.push(null);
                        weeks.push(currentWeek);
                      }
                      return weeks.map((week, col) => (
                        <div key={col} className="flex flex-col gap-1">
                          {week.map((day, row) => {
                            if (!day) return <div key={row} className="w-3 h-3 rounded-sm bg-transparent" />;
                            let color = 'bg-gray-200 dark:bg-white/5';
                            if (day.level === 4) color = 'bg-brand-steel';
                            else if (day.level === 3) color = 'bg-brand-periwinkle';
                            else if (day.level === 2) color = 'bg-brand-ice';
                            else if (day.level === 1) color = 'bg-brand-ice/50';
                            return <div key={row} title={`${day.count} contributions on ${day.date}`} className={`w-3 h-3 rounded-sm ${color}`} />
                          })}
                        </div>
                      ));
                    })() : (
                      Array.from({length: 52}).map((_, col) => (
                        <div key={col} className="flex flex-col gap-1">
                          {Array.from({length: 7}).map((_, row) => {
                            const intensity = Math.random();
                            let color = 'bg-gray-200 dark:bg-white/5';
                            if (intensity > 0.8) color = 'bg-brand-steel';
                            else if (intensity > 0.6) color = 'bg-brand-periwinkle';
                            else if (intensity > 0.4) color = 'bg-brand-ice';
                            return <div key={row} className={`w-3 h-3 rounded-sm ${color}`} />
                          })}
                        </div>
                      ))
                    )}
                  </div>
                  <div className={`flex justify-between items-center mt-2 text-[10px] text-authra-text-sec-light dark:text-[#9AA8D6] font-mono ${!user.github ? 'blur-[2px]' : ''}`}>
                    <span>{githubData && githubData.total ? `${githubData.total.lastYear || Object.values(githubData.total)[0] || 0} contributions in the last year` : '1,204 contributions in the last year'}</span>
                    <div className="flex items-center gap-1">
                      <span>Less</span>
                      <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-white/5"></div>
                      <div className="w-3 h-3 rounded-sm bg-brand-ice"></div>
                      <div className="w-3 h-3 rounded-sm bg-brand-periwinkle"></div>
                      <div className="w-3 h-3 rounded-sm bg-brand-steel"></div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Projects */}
            {user?.projects && user.projects.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Folder className="w-5 h-5 text-brand-steel" />
                  <h2 className="text-xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">Top Projects</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-5 mb-8">
                  {user.projects.slice(0, 3).map((project, idx) => (
                    <div key={idx} className="group bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-6 hover:border-brand-steel dark:hover:border-brand-steel transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-authra-text-light dark:text-[#F5F8FF] group-hover:text-brand-steel transition-colors">{project.title}</h3>
                        <div className="flex items-center gap-3">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel dark:hover:text-brand-ice transition-colors">
                              <GithubIcon className="w-5 h-5" />
                            </a>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel dark:hover:text-brand-ice transition-colors">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] mb-4">{project.description}</p>
                      
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[11px] font-medium text-authra-text-light dark:text-[#F5F8FF] border border-black/5 dark:border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Certificates */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-steel" />
                  <h2 className="text-xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">Authra Verified Credentials</h2>
                </div>
                <Link to={`/u/${user.username || user.email}/certificates`} className="flex items-center gap-1 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
                  See all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {authraCerts.map((cert) => (
                  <div key={cert.id} className="group bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] overflow-hidden hover:-translate-y-1 transition-all duration-300">
                    <div className={`h-24 bg-gradient-to-br ${cert.color} relative overflow-hidden flex items-center justify-center border-b ${cert.borderColor}`}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="absolute top-3 right-3 bg-white dark:bg-black rounded-full p-1 shadow-md" title="Cryptographically Verified">
                        <ShieldCheck className="w-4 h-4 text-brand-steel" />
                      </div>
                      <div className="absolute bottom-3 right-3 z-20">
                        <DownloadOffscreenButton credentialId={cert.id} className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-md font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-1 line-clamp-1">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] mb-4">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-authra-border-light dark:border-[#2A3155]">
                        <div className="flex items-center gap-2 text-[11px] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-wider font-medium">
                          <Calendar className="w-3 h-3" />
                          {cert.issueDate}
                        </div>
                        <Link to={`/verify/${cert.id}`} className="text-brand-steel hover:text-brand-ice text-xs font-medium transition-colors">
                          Verify
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded/External Certificates */}
            {externalCerts.length > 0 && (
              <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155] rounded-[20px] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FileBadge className="w-5 h-5 text-brand-steel" />
                  <h2 className="text-xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">External Certifications</h2>
                </div>
                
                <div className="space-y-4">
                  {externalCerts.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-authra-bg-light dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155]">
                      <div>
                        <h4 className="text-sm font-semibold text-authra-text-light dark:text-[#F5F8FF]">{cert.title}</h4>
                        <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6] mt-0.5">{cert.issuer}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6]">{cert.issueDate}</span>
                        {(cert.fileUrl || cert.link) && (
                          <a href={cert.fileUrl || cert.link} target="_blank" rel="noopener noreferrer" className="p-2 text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
