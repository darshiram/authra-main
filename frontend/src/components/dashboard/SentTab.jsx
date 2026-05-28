import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';

export default function SentTab({ issuedCertificates }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'Opened': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'Bounced': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'Revoked': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default: return 'bg-brand-steel/10 text-brand-steel';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
            Sent Certificates
          </h1>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
            View issuance logs, track delivery status, and manage access.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
          <input 
            type="text" 
            placeholder="Search name, email, or mobile..." 
            className="w-full bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white placeholder-authra-text-sec-light dark:placeholder-authra-text-sec-dark"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/50 dark:bg-authra-bg-dark/50">
                <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Recipient</th>
                <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Credential ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Date Sent</th>
                <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
              {issuedCertificates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">
                    No sent certificates found.
                  </td>
                </tr>
              ) : (
                issuedCertificates.map((cert, i) => (
                  <tr key={i} className="hover:bg-authra-bg-light/50 dark:hover:bg-[#111522] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel font-semibold text-xs">
                          {cert.recipientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-authra-text-light dark:text-white">{cert.recipientName}</p>
                          <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">{cert.recipientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-authra-text-light dark:text-white bg-authra-bg-light dark:bg-[#111522] px-2.5 py-1 rounded-md border border-authra-border-light dark:border-authra-border-dark">
                        {cert.credentialId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles('Delivered')}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                        Delivered
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link to={`/verify/${cert.credentialId}`} target="_blank" className="text-brand-steel hover:text-brand-ice transition-colors p-2 hover:bg-brand-steel/10 rounded-lg inline-flex" title="View Certificate">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-authra-border-light dark:border-authra-border-dark flex items-center justify-between text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
          <p>Showing 1 to 4 of 1,204 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-md border border-authra-border-light dark:border-authra-border-dark hover:bg-white dark:hover:bg-[#0D0F16] disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1.5 rounded-md border border-authra-border-light dark:border-authra-border-dark hover:bg-white dark:hover:bg-[#0D0F16] transition-colors">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
