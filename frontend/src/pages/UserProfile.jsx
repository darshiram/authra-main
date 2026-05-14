import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import { ShieldCheck, Award, Calendar, Share2, ExternalLink, Loader2, Link as LinkIcon, Check, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DownloadOffscreenButton from '../components/DownloadOffscreenButton';
import { Helmet } from 'react-helmet-async';
import { axiosInstance } from '../config/api';

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [platformCerts, setPlatformCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/me`);
        if (res.data.username && res.data.username !== username) {
          navigate(`/user/${res.data.username}`);
          return;
        }
        setUser({
          ...res.data,
          avatar: res.data.name ? res.data.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U',
          bio: res.data.bio || 'Passionate about learning and verifying credentials.',
          totalCertificates: res.data.totalCertificates || 0,
          role: res.data.role || 'Member'
        });
        const resCerts = await axiosInstance.get(`/certificates/my`);
        setPlatformCerts(resCerts.data);
      } catch (err) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username, navigate]);

  const platformCertificates = platformCerts.map((cert) => ({
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

  const externalCertificates = user?.certificates?.map((cert, index) => ({
    id: `EXT-${index}`,
    title: cert.title,
    issuer: cert.issuer,
    issueDate: cert.issueDate,
    skills: cert.skills || [],
    verified: false,
    link: cert.link,
    fileUrl: cert.fileUrl,
    color: 'from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20',
    borderColor: 'border-gray-500/30 dark:border-slate-500/30'
  })) || [];

  const certificates = [...platformCertificates, ...externalCertificates];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-authra-bg-light dark:bg-[#0D0F16]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-authra-bg-light dark:bg-[#0D0F16]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-authra-text-light dark:text-white mb-2">User Not Found</h2>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">{error}</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.origin + `/u/${user?.username || user?.email?.split('@')[0] || 'user'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>{user.name || 'User'}'s Credentials | Authra</title>
      </Helmet>

      <Navbar />

      <main className="relative z-10 min-h-screen pt-[120px] pb-20 px-6">
        {/* Background Ambient Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Dark Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#fff_70%,transparent_100%)]" />
          
          <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-brand-steel/10 dark:bg-brand-steel/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[25%] right-[10%] w-[800px] h-[800px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/15 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute top-[60%] left-[-10%] w-[700px] h-[700px] bg-brand-ice/10 dark:bg-brand-ice/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto">
          
          {/* Profile Header */}
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-3xl p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-periwinkle/10 dark:bg-brand-steel/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-brand-steel to-brand-ice flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-xl shrink-0">
                {user.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-[590] text-authra-text-light dark:text-white mb-1">
                      {user.name || 'User'}
                    </h1>
                    <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium">
                      @{user.username || user.email?.split('@')[0] || 'user'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate('/manage-portfolio')}
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-brand-steel/50 dark:border-brand-steel text-sm font-[510] text-authra-text-light dark:text-brand-ice hover:bg-brand-steel/10 dark:hover:bg-brand-steel/20 hover:shadow-[0_0_15px_rgba(95,110,183,0.3)] transition-all duration-300"
                    >
                      <Award className="w-4 h-4" />
                      Manage Portfolio
                    </button>
                    
                    <div className="relative" ref={shareRef}>
                      <button 
                        onClick={() => setIsShareOpen(!isShareOpen)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-authra-border-light dark:border-authra-border-dark text-sm font-medium text-authra-text-light dark:text-white hover:bg-authra-bg-light dark:hover:bg-white/5 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Profile
                      </button>
                    
                    {/* Share Dropdown Menu */}
                    <div className={`absolute right-0 mt-3 w-64 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${isShareOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <div className="p-4 border-b border-authra-border-light dark:border-[#2A3155]">
                        <p className="text-sm font-semibold text-authra-text-light dark:text-[#F5F8FF] mb-1">Share your public profile</p>
                        <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6]">Anyone with this link can view your credentials.</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={handleCopyLink}
                          className="flex items-center justify-between w-full p-3 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <LinkIcon className="w-4 h-4 text-brand-steel group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Copy Link</span>
                          </div>
                          {copied && <Check className="w-4 h-4 text-green-500" />}
                        </button>
                        
                        <a 
                          href={`https://twitter.com/intent/tweet?text=Check out my verified professional credentials on Authra!&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full p-3 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] dark:hover:bg-[#1DA1F2]/20 dark:hover:text-[#1DA1F2] rounded-xl transition-colors group"
                        >
                          <TwitterIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Share on X</span>
                        </a>
                        
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full p-3 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] dark:hover:bg-[#0A66C2]/20 dark:hover:text-[#0A66C2] rounded-xl transition-colors group"
                        >
                          <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Share on LinkedIn</span>
                        </a>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-authra-text-light dark:text-white font-medium mb-3">
                  {user.role}
                </p>
                <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark leading-relaxed max-w-2xl mb-8">
                  {user.bio}
                </p>

                {/* Stats Matrix */}
                <div className="flex items-center justify-center md:justify-start gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-bold text-authra-text-light dark:text-white mb-1">
                      {user.totalCertificates}
                    </p>
                    <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium uppercase tracking-wider">
                      Verified Credentials
                    </p>
                  </div>
                  <div className="w-px h-12 bg-authra-border-light dark:bg-authra-border-dark"></div>
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-bold text-authra-text-light dark:text-white mb-1">
                      {certificates.reduce((acc, curr) => acc + curr.skills.length, 0)}
                    </p>
                    <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium uppercase tracking-wider">
                      Validated Skills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Grid */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-brand-steel" />
              <h2 className="text-2xl font-[590] text-authra-text-light dark:text-white">Earned Credentials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="group bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(115,135,197,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Top Graphic */}
                  {cert.fileUrl ? (
                    <div className="h-48 w-full relative overflow-hidden bg-black/5 dark:bg-white/5 border-b border-authra-border-light dark:border-authra-border-dark flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                      {cert.fileUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full pointer-events-none scale-[0.6] origin-top">
                           <PDFViewer url={cert.fileUrl} />
                        </div>
                      ) : (
                        <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
                        <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2">
                          <Eye className="w-4 h-4" /> View Full
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className={`h-32 bg-gradient-to-br ${cert.color} relative overflow-hidden flex items-center justify-center p-6 border-b ${cert.borderColor}`}>
                      <div className="w-full max-w-[200px] h-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center shadow-sm relative rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <div className="w-8 h-8 rounded-full border-2 border-current opacity-30"></div>
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <div className="w-4 h-1 bg-current opacity-20 rounded-full"></div>
                          <div className="w-2 h-1 bg-current opacity-20 rounded-full"></div>
                        </div>
                      </div>
                      {cert.verified && (
                        <div className="absolute top-4 right-4 bg-white dark:bg-black rounded-full p-1 shadow-md" title="Cryptographically Verified">
                          <ShieldCheck className="w-5 h-5 text-brand-steel" />
                        </div>
                      )}
                      {cert.verified && (
                        <div className="absolute bottom-4 right-4 z-20">
                          <DownloadOffscreenButton credentialId={cert.id} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-authra-text-light dark:text-white mb-1 group-hover:text-brand-steel transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark">
                        Issued by {cert.issuer}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {cert.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-authra-bg-light dark:bg-white/5 text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark border border-authra-border-light dark:border-authra-border-dark">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-authra-border-light dark:border-authra-border-dark flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Issued: {cert.issueDate}
                      </div>
                      {cert.verified ? (
                        <Link to={`/verify/${cert.id}`} className="text-brand-steel hover:text-brand-ice flex items-center gap-1 text-sm font-medium transition-colors">
                          Verify <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (cert.fileUrl || cert.link) ? (
                        <a href={cert.fileUrl || cert.link} target="_blank" rel="noopener noreferrer" className="text-brand-steel hover:text-brand-ice flex items-center gap-1 text-sm font-medium transition-colors">
                          View Credential <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-xs font-medium">Self Reported</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
