import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export default function DownloadPDFButton({ targetId, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById(targetId);
      if (!element) throw new Error('Certificate element not found');

      // Temporarily store the original style
      const originalTransform = element.style.transform;
      
      // Temporarily ensure it renders without transform scaling if any was applied by parent
      element.style.transform = 'none';

      // Capture the element. We scale it up so the PDF is high resolution.
      const canvas = await html2canvas(element, {
        scale: 2, // 2x resolution
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      // Restore original style
      element.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');
      
      // Certificate aspect ratio is 11/8.5 (Letter Landscape)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter' // 279.4 x 215.9 mm
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert(`Failed to generate PDF. Error: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="group relative flex items-center justify-center w-10 h-10 hover:w-36 bg-brand-steel/10 hover:bg-brand-steel text-brand-steel hover:text-white rounded-full transition-all duration-300 overflow-hidden shadow-sm disabled:opacity-50"
      title="Download PDF"
    >
      <div className="absolute left-2.5 flex items-center justify-center">
        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      </div>
      <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap ml-6 text-sm font-medium transition-opacity duration-300">
        {isDownloading ? 'Generating...' : 'Download PDF'}
      </span>
    </button>
  );
}
