import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { axiosInstance } from '../config/api';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { createRoot } from 'react-dom/client';

import ModernMinimalist from './certificate-templates/ModernMinimalist';
import CyberpunkGrid from './certificate-templates/CyberpunkGrid';
import ExecutiveGlass from './certificate-templates/ExecutiveGlass';

export default function DownloadOffscreenButton({ credentialId, className }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Fetch data
      const res = await axiosInstance.get(`/certificates/verify/${credentialId}`);
      const cert = res.data;
      
      const data = {
        issuerName: cert.issuerId?.name || 'Organization',
        recipientName: cert.recipientName,
        title: cert.eventName || 'Certificate',
        skills: cert.additionalDetails?.skills,
        issueDate: new Date(cert.issueDate).toLocaleDateString(),
        credentialId: cert.credentialId
      };

      // Create an offscreen container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '-10000px';
      container.style.width = '1000px'; // Force fixed width
      document.body.appendChild(container);

      const root = createRoot(container);
      
      let Template;
      if (cert.templateId === 'cyberpunk') Template = CyberpunkGrid;
      else if (cert.templateId === 'executive') Template = ExecutiveGlass;
      else Template = ModernMinimalist;

      // Render the component
      await new Promise(resolve => {
        root.render(
          <div id={`offscreen-cert-${cert.credentialId}`}>
            <Template data={data} />
          </div>
        );
        // Wait for render and fonts to load
        setTimeout(resolve, 800);
      });

      const element = document.getElementById(`offscreen-cert-${cert.credentialId}`);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`${cert.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(container);

    } catch (err) {
      console.error(err);
      alert('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }}
      disabled={isDownloading}
      className={`group relative flex items-center justify-center w-8 h-8 hover:w-28 bg-authra-border-light dark:bg-white/10 hover:bg-brand-steel text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-white rounded-full transition-all duration-300 overflow-hidden shadow-sm disabled:opacity-50 ${className || ''}`}
      title="Download PDF"
    >
      <div className="absolute left-1.5 flex items-center justify-center">
        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </div>
      <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap ml-5 text-[11px] font-medium transition-opacity duration-300">
        {isDownloading ? '...' : 'Download'}
      </span>
    </button>
  );
}
