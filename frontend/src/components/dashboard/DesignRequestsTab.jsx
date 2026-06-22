import React, { useState, useEffect } from 'react';
import { Plus, Palette, Clock, CheckCircle2, XCircle, FileImage, FileText, Loader2, Link as LinkIcon, Download } from 'lucide-react';
import { axiosInstance } from '../../config/api';
import { useToast } from '../../context/ToastContext';

export default function DesignRequestsTab({ setShowRequestDesignModal }) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/design-requests');
      setRequests(res.data);
    } catch (err) {
      showToast('Failed to fetch design requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'In Progress': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
            Design Requests
          </h1>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
            Track the status of your custom certificate design requests.
          </p>
        </div>
        <button 
          onClick={() => setShowRequestDesignModal(true)}
          className="btn-primary w-fit flex items-center gap-2 shadow-lg shadow-brand-steel/20"
        >
          <Plus className="w-4 h-4" />
          Request New Design
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-steel/10 flex items-center justify-center mb-6">
            <Palette className="w-8 h-8 text-brand-steel" />
          </div>
          <h3 className="text-xl font-bold text-authra-text-light dark:text-white mb-2">No Design Requests</h3>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark max-w-md mx-auto mb-8">
            You haven't submitted any custom design requests yet. We can create beautiful, tailored certificates for your organization.
          </p>
          <button 
            onClick={() => setShowRequestDesignModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Request Your First Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map(request => (
            <div key={request._id} className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm hover:border-brand-steel dark:hover:border-brand-steel transition-colors group">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Details Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-authra-text-light dark:text-white group-hover:text-brand-steel transition-colors">
                        {request.title}
                      </h3>
                      <p className="text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider mt-1">
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusClass(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </div>
                  </div>

                  <div className="bg-authra-bg-light dark:bg-[#111522] rounded-xl p-4 border border-authra-border-light dark:border-[#2A3155]">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-brand-steel shrink-0 mt-0.5" />
                      <p className="text-sm text-authra-text-light dark:text-[#F5F8FF] leading-relaxed">
                        {request.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                {request.attachments && request.attachments.length > 0 && (
                  <div className="lg:w-72 flex-shrink-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-authra-border-light dark:border-authra-border-dark">
                    <h4 className="text-xs font-semibold text-authra-text-light dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-brand-periwinkle" />
                      Reference Materials
                    </h4>
                    <div className="space-y-2">
                      {request.attachments.map((url, i) => (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-authra-bg-light dark:bg-[#111522] hover:bg-black/5 dark:hover:bg-white/5 border border-authra-border-light dark:border-[#2A3155] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-steel/10 flex items-center justify-center text-brand-steel">
                            <LinkIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-authra-text-light dark:text-white truncate">Attachment {i + 1}</p>
                            <p className="text-[10px] text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase">View File</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Feedback Section */}
              {(request.adminFeedback || request.templateId) && (
                <div className="mt-6 pt-6 border-t border-authra-border-light dark:border-authra-border-dark">
                  {request.adminFeedback && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-authra-text-light dark:text-white mb-2">Feedback from Design Team</h4>
                      <div className="bg-brand-steel/5 rounded-xl p-4 border border-brand-steel/10 text-sm text-authra-text-light dark:text-white italic">
                        "{request.adminFeedback}"
                      </div>
                    </div>
                  )}
                  {request.templateId && request.status === 'Completed' && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Design Available</h4>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">Your new template '{request.templateName || request.templateId}' is ready to use in the Templates tab.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
