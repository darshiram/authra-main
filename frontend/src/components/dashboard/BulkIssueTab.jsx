import React from 'react';
import { UploadCloud, AlertCircle, FileText } from 'lucide-react';

export default function BulkIssueTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
          Bulk Issue Certificates
        </h1>
        <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
          Upload a CSV file to issue multiple credentials simultaneously.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden p-8 md:p-12">
        
        <div className="w-full border-2 border-dashed border-authra-border-light dark:border-authra-border-dark hover:border-brand-steel dark:hover:border-brand-steel bg-authra-bg-light/30 dark:bg-[#0A0D14] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
          <div className="w-16 h-16 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-6 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-authra-text-light dark:text-white mb-2">Drag & Drop your CSV file here</h3>
          <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-6">or click to browse from your computer (max 5MB)</p>
          
          <button className="px-6 py-2.5 rounded-full text-sm font-[510] bg-brand-steel text-white shadow-[0_0_15px_rgba(95,110,183,0.4)] hover:shadow-[0_0_25px_rgba(95,110,183,0.6)] hover:brightness-110 hover:scale-105 transition-all duration-300">
            Browse Files
          </button>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-brand-steel/5 dark:bg-brand-steel/10 border border-brand-steel/20 rounded-xl p-5 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-brand-steel shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-authra-text-light dark:text-white mb-1">Formatting Required</h4>
              <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark leading-relaxed">
                Ensure your CSV contains columns exactly named <strong>Name</strong>, <strong>Email</strong>, and <strong>Issue Date</strong>. Maximum of 500 rows allowed per batch upload.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center p-5 md:p-0">
            <button className="flex items-center gap-2 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
              <FileText className="w-4 h-4" />
              Download CSV Template
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
