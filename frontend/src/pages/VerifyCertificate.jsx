import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { ShieldCheck, XCircle, ArrowLeft, Loader2, Award, Calendar, Layers, MapPin } from 'lucide-react';
import ModernMinimalist from '../components/certificate-templates/ModernMinimalist';
import CyberpunkGrid from '../components/certificate-templates/CyberpunkGrid';
import ExecutiveGlass from '../components/certificate-templates/ExecutiveGlass';
import DownloadPDFButton from '../components/DownloadPDFButton';

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function VerifyCertificate() {
  const { credentialId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/users/me');
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await axiosInstance.get(`/certificates/verify/${credentialId}`);
        setCertificate(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not found or invalid');
      } finally {
        setIsLoading(false);
      }
    };
    verifyCertificate();
  }, [credentialId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-steel animate-spin" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-authra-text-light dark:text-white mb-2">Invalid Credential</h1>
        <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark mb-8 max-w-md">
          {error}
        </p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  const renderTemplate = () => {
    const data = {
      issuerName: certificate.issuerId?.name || 'Organization',
      recipientName: certificate.recipientName,
      title: certificate.additionalDetails?.title || certificate.eventName || 'Certificate of Completion',
      eventName: certificate.additionalDetails?.eventName,
      rank: certificate.additionalDetails?.rank || '',
      skills: certificate.additionalDetails?.skills,
      issueDate: certificate.issueDate,
      credentialId: certificate.credentialId
    };

    switch (certificate.templateId) {
      case 'modern': return <ModernMinimalist data={data} />;
      case 'cyberpunk': return <CyberpunkGrid data={data} />;
      case 'executive': return <ExecutiveGlass data={data} />;
      default: return <ModernMinimalist data={data} />;
    }
  };

  const handleAddToLinkedIn = () => {
    const title = encodeURIComponent(certificate.additionalDetails?.title || certificate.eventName || 'Certificate of Completion');
    const org = encodeURIComponent(certificate.issuerId?.name || 'Authra Issuer');
    const issueDate = new Date(certificate.issueDate);
    const year = issueDate.getFullYear();
    const month = issueDate.getMonth() + 1;
    const certUrl = encodeURIComponent(window.location.href);
    const certId = encodeURIComponent(certificate.credentialId);
    
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${title}&organizationName=${org}&issueYear=${year}&issueMonth=${month}&certUrl=${certUrl}&certId=${certId}`;
    
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-authra-bg-dark py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-full font-medium text-sm tracking-wide">
            <ShieldCheck className="w-5 h-5" /> Verified Authra Credential
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-authra-text-light dark:text-white">
            Official Credential Record
          </h1>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark max-w-xl mx-auto">
            This credential is cryptographically secured on the Authra network and has been verified as authentic.
          </p>
        </div>

        {/* Certificate Display */}
        <div className="w-full relative rounded-xl overflow-hidden shadow-2xl shadow-brand-steel/5 border border-authra-border-light dark:border-authra-border-dark bg-[#0A0C10] group">
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleAddToLinkedIn}
                className="group/linkedin relative flex items-center justify-center w-10 h-10 hover:w-36 bg-brand-steel/10 hover:bg-brand-steel text-brand-steel hover:text-white rounded-full transition-all duration-300 overflow-hidden shadow-sm"
                title="Add to LinkedIn Profile"
              >
                <div className="absolute left-2.5 flex items-center justify-center">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <span className="opacity-0 group-hover/linkedin:opacity-100 whitespace-nowrap ml-6 text-sm font-medium transition-opacity duration-300">
                  Add to Profile
                </span>
              </button>
            )}
            <DownloadPDFButton 
              targetId={`cert-${certificate.credentialId}`} 
              fileName={`${certificate.recipientName}_Certificate`} 
            />
          </div>
          <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
            <foreignObject width="1000" height="772.72">
              <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                {renderTemplate()}
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-4">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1">Issued To</p>
            <p className="font-semibold text-authra-text-light dark:text-white">{certificate.recipientName}</p>
          </div>
          
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1">Issue Date</p>
            <p className="font-semibold text-authra-text-light dark:text-white">{new Date(certificate.issueDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1">College / Institution</p>
            <p className="font-semibold text-authra-text-light dark:text-white">{certificate.additionalDetails?.college || 'N/A'}</p>
          </div>

          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1">Event Name</p>
            <p className="font-semibold text-authra-text-light dark:text-white">{certificate.additionalDetails?.eventName || 'N/A'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
