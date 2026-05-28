import React from 'react';
import { UploadCloud, Loader2, Trash2, Settings } from 'lucide-react';

export default function SettingsTab({
  user,
  settingsForm,
  setSettingsForm,
  isSavingSettings,
  handleSaveSettings,
  isUploadingLogo,
  isUploadingBanner,
  handleLogoUpload,
  handleBannerUpload
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
          Organization Settings
        </h1>
        <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
          Manage your public organization profile and contact details.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
          <h3 className="font-semibold text-authra-text-light dark:text-white">Profile Information</h3>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          {/* Logo Upload Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-authra-border-light dark:border-authra-border-dark">
            <div className="relative w-20 h-20 rounded-xl bg-authra-bg-light dark:bg-[#0A0C10] border border-authra-border-light dark:border-authra-border-dark flex items-center justify-center overflow-hidden shrink-0">
              {settingsForm.logoUrl ? (
                <img src={settingsForm.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="w-8 h-8 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
              )}
              {isUploadingLogo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-authra-text-light dark:text-white mb-1">Organization Logo</h4>
              <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark mb-3">JPG or PNG. Max 5MB.</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:bg-authra-bg-light dark:hover:bg-[#0A0C10] text-xs font-medium transition-colors text-authra-text-light dark:text-white">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Logo
                <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
              </label>
            </div>
          </div>

          {/* Banner Upload Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-authra-border-light dark:border-authra-border-dark">
            <div className="relative w-40 h-16 rounded-xl bg-authra-bg-light dark:bg-[#0A0C10] border border-authra-border-light dark:border-authra-border-dark flex items-center justify-center overflow-hidden shrink-0">
              {settingsForm.bannerUrl ? (
                <img src={settingsForm.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="w-6 h-6 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
              )}
              {isUploadingBanner && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-authra-text-light dark:text-white mb-1">Organization Banner</h4>
              <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark mb-3">JPG or PNG. Max 5MB. Recommended: 1128 x 191 px</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:bg-authra-bg-light dark:hover:bg-[#0A0C10] text-xs font-medium transition-colors text-authra-text-light dark:text-white">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Banner
                <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleBannerUpload} disabled={isUploadingBanner} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Organization Name</label>
              <input 
                type="text" 
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Username (Public Profile URL)</label>
              <input 
                type="text" 
                value={settingsForm.username}
                onChange={(e) => setSettingsForm({...settingsForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                placeholder="your_org"
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Email Address <span className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">(Read-only)</span></label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full bg-gray-50 dark:bg-[#0A0C10] border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark cursor-not-allowed opacity-70" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Contact Number</label>
              <input 
                type="text" 
                value={settingsForm.mobileNo}
                onChange={(e) => setSettingsForm({...settingsForm, mobileNo: e.target.value})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Website URL</label>
              <input 
                type="url" 
                value={settingsForm.website}
                onChange={(e) => setSettingsForm({...settingsForm, website: e.target.value})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">LinkedIn Profile</label>
              <input 
                type="url" 
                value={settingsForm.linkedin}
                onChange={(e) => setSettingsForm({...settingsForm, linkedin: e.target.value})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                placeholder="https://linkedin.com/company/your-org"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">GitHub Organization</label>
              <input 
                type="url" 
                value={settingsForm.github}
                onChange={(e) => setSettingsForm({...settingsForm, github: e.target.value})}
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                placeholder="https://github.com/your-org"
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">About Organization</label>
            <textarea 
              value={settingsForm.aboutOrg}
              onChange={(e) => setSettingsForm({...settingsForm, aboutOrg: e.target.value})}
              className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white h-24 resize-none" 
              placeholder="Tell us about your organization..."
            />
          </div>

          <div className="space-y-2 mt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Gallery Images (URLs)</label>
              <button 
                onClick={() => setSettingsForm({...settingsForm, gallery: [...settingsForm.gallery, '']})}
                className="text-xs text-brand-steel hover:text-brand-ice font-medium transition-colors"
              >
                + Add Image URL
              </button>
            </div>
            {settingsForm.gallery.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => {
                    const newGallery = [...settingsForm.gallery];
                    newGallery[idx] = e.target.value;
                    setSettingsForm({...settingsForm, gallery: newGallery});
                  }}
                  className="flex-1 bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                  placeholder="https://example.com/image.jpg"
                />
                <button 
                  onClick={() => {
                    const newGallery = settingsForm.gallery.filter((_, i) => i !== idx);
                    setSettingsForm({...settingsForm, gallery: newGallery});
                  }}
                  className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30 flex items-center justify-end">
          <button 
            onClick={handleSaveSettings}
            disabled={isSavingSettings}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
            {isSavingSettings ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
