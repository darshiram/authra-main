import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { axiosInstance } from '../../config/api';

export default function RequestDesignModal({
  showRequestDesignModal,
  setShowRequestDesignModal,
  requestDesignForm,
  setRequestDesignForm
}) {
  const { showToast } = useToast();

  if (!showRequestDesignModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark flex justify-between items-center bg-authra-bg-light/30 dark:bg-[#0A0C10]">
          <h2 className="text-xl font-semibold text-authra-text-light dark:text-white">Request Custom Template</h2>
          <button onClick={() => setShowRequestDesignModal(false)} className="text-authra-text-sec-light hover:text-authra-text-light dark:text-authra-text-sec-dark dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Requirements Description</label>
            <textarea 
              className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white min-h-[120px]"
              placeholder="Describe your brand colors, style, required fields, and overall vibe..."
              value={requestDesignForm.description}
              onChange={(e) => setRequestDesignForm({...requestDesignForm, description: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Design Reference Link (Optional)</label>
            <input 
              type="url"
              className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white"
              placeholder="e.g. Google Drive, Dropbox, Figma link..."
              value={requestDesignForm.link}
              onChange={(e) => setRequestDesignForm({...requestDesignForm, link: e.target.value})}
            />
          </div>
          <button 
            onClick={async () => {
              if(!requestDesignForm.description.trim()) return showToast("Please provide a description", "error");
              
              try {
                await axiosInstance.post('/design-requests', requestDesignForm);
                showToast('Request submitted! Our design team will contact you shortly.', 'success');
                setShowRequestDesignModal(false);
                setRequestDesignForm({ description: '', link: '' });
              } catch (err) {
                showToast(err.response?.data?.message || 'Error submitting request', 'error');
              }
            }}
            className="btn-primary w-full mt-4"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
