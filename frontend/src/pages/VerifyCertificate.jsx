import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { ShieldCheck, XCircle, ArrowLeft, Loader2, Award, Calendar, Layers, MapPin } from 'lucide-react';
import ModernMinimalist from '../components/certificate-templates/ModernMinimalist';
import CyberpunkGrid from '../components/certificate-templates/CyberpunkGrid';
import ExecutiveGlass from '../components/certificate-templates/ExecutiveGlass';
import DownloadPDFButton from '../components/DownloadPDFButton';

export default function VerifyCertificate() {
  const { credentialId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      title: certificate.eventName || 'Certificate of Completion',
      skills: certificate.additionalDetails?.skills,
      issueDate: new Date(certificate.issueDate).toLocaleDateString(),
      credentialId: certificate.credentialId
    };

    switch (certificate.templateId) {
      case 'modern': return <ModernMinimalist data={data} />;
      case 'cyberpunk': return <CyberpunkGrid data={data} />;
      case 'executive': return <ExecutiveGlass data={data} />;
      default: return <ModernMinimalist data={data} />;
    }
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
          <div className="absolute top-4 right-4 z-50">
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
