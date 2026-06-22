import React from 'react';
import {
  ShieldCheck,
  Award,
  Calendar,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { getTemplateComponent, getDefaultTemplates } from '../certificate-templates/TemplateRegistry';

export default function IssueTab({
  user,
  settingsForm,
  issueRecipients,
  setIssueRecipients,
  selectedTemplate,
  setSelectedTemplate,
  issueDate,
  setIssueDate,
  additionalDetails,
  setAdditionalDetails,
  skillInput,
  setSkillInput,
  isIssuing,
  handleIssueCertificates
}) {
  const previewData = {
    issuerName: settingsForm.name || user?.name || "Your Organization",
    recipientName: issueRecipients[0]?.name || "Recipient Name",
    title: additionalDetails.title,
    eventName: additionalDetails.eventName,
    rank: additionalDetails.rank || "",
    skills: additionalDetails.skills,
    issueDate: issueDate,
    credentialId: "PREVIEW-1234"
  };

  const defaultTemplates = getDefaultTemplates();
  const customTemplates = user?.customTemplates || [];
  const allTemplates = [...defaultTemplates, ...customTemplates];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
          Issue New Certificates
        </h1>
        <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
          Issue a cryptographically verified credential to multiple recipients simultaneously.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Form */}
        <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark flex items-center justify-between bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-steel/10 flex items-center justify-center text-brand-steel">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-authra-text-light dark:text-white text-base">Credential Details</h3>
                <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">Configure certificate properties.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            {/* 1. Certificate Basics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-steel/20 text-brand-steel flex items-center justify-center text-xs font-bold">1</span>
                <h4 className="font-semibold text-authra-text-light dark:text-white">Certificate Basics</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Certificate Title *</label>
                  <input 
                    type="text" 
                    value={additionalDetails.title}
                    onChange={(e) => setAdditionalDetails({...additionalDetails, title: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white font-medium" 
                    placeholder="e.g. Advanced Full-Stack Engineering" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Event Name *</label>
                  <input 
                    type="text" 
                    value={additionalDetails.eventName}
                    onChange={(e) => setAdditionalDetails({...additionalDetails, eventName: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white font-medium" 
                    placeholder="e.g. Annual Hackathon 2026" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Certificate Template</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-authra-text-sec-light dark:text-authra-text-sec-dark">
                      <Award className="w-4 h-4" />
                    </div>
                    <select 
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white appearance-none"
                    >
                      {allTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Issue Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-authra-text-sec-light dark:text-authra-text-sec-dark">
                      <Calendar className="w-4 h-4" />
                    </div>
                  <input 
                    type="date" 
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                  />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Recipient Information */}
            <div className="pt-6 border-t border-authra-border-light dark:border-authra-border-dark">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold">2</span>
                  <h4 className="font-semibold text-authra-text-light dark:text-white">Recipient Information</h4>
                </div>
                <span className="text-xs text-brand-steel font-medium">{issueRecipients.length} Recipient(s)</span>
              </div>
              
              <div className="space-y-4">
                {issueRecipients.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 bg-authra-bg-light/50 dark:bg-white/5 p-4 rounded-xl relative group">
                    {issueRecipients.length > 1 && (
                      <button 
                        onClick={() => setIssueRecipients(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        value={rec.name}
                        onChange={(e) => {
                          const newRec = [...issueRecipients];
                          newRec[i].name = e.target.value;
                          setIssueRecipients(newRec);
                        }}
                        className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                        placeholder="Recipient Name (e.g. Alex Developer)" 
                      />
                      <input 
                        type="email" 
                        value={rec.email}
                        onChange={(e) => {
                          const newRec = [...issueRecipients];
                          newRec[i].email = e.target.value;
                          setIssueRecipients(newRec);
                        }}
                        className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                        placeholder="Email Address" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIssueRecipients([...issueRecipients, { name: '', email: '' }])}
                className="w-full mt-4 py-3 rounded-xl border border-dashed border-brand-steel/50 text-brand-steel hover:bg-brand-steel/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Another Recipient
              </button>
            </div>

            {/* 3. Additional Details */}
            <div className="pt-6 border-t border-authra-border-light dark:border-authra-border-dark">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">3</span>
                <h4 className="font-semibold text-authra-text-light dark:text-white">Additional Details</h4>
                <span className="text-[10px] uppercase tracking-wider text-authra-text-sec-light ml-2 font-medium">Optional</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-3 py-2 focus-within:border-brand-steel focus-within:ring-1 focus-within:ring-brand-steel transition-all min-h-[46px] flex flex-wrap gap-2 items-center">
                    {additionalDetails.skills.split(',').filter(s => s.trim()).map((skill, index) => (
                      <span key={index} className="flex items-center gap-1 px-2.5 py-1 bg-brand-steel/10 text-brand-steel rounded-md text-xs font-medium">
                        {skill.trim()}
                        <button 
                          type="button"
                          onClick={() => {
                            const newSkills = additionalDetails.skills.split(',').map(s => s.trim()).filter(Boolean).filter((_, i) => i !== index).join(', ');
                            setAdditionalDetails({...additionalDetails, skills: newSkills});
                          }}
                          className="hover:text-brand-ice"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            const currentSkills = additionalDetails.skills ? additionalDetails.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                            currentSkills.push(skillInput.trim());
                            setAdditionalDetails({...additionalDetails, skills: currentSkills.join(', ')});
                            setSkillInput('');
                          }
                        } else if (e.key === 'Backspace' && !skillInput && additionalDetails.skills) {
                           const skillsArray = additionalDetails.skills.split(',').map(s => s.trim()).filter(Boolean);
                           skillsArray.pop();
                           setAdditionalDetails({...additionalDetails, skills: skillsArray.join(', ')});
                        }
                      }}
                      className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none text-authra-text-light dark:text-white" 
                      placeholder={additionalDetails.skills ? "" : "Skills Learned (press Enter)"} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      value={additionalDetails.rank}
                      onChange={(e) => setAdditionalDetails({...additionalDetails, rank: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                      placeholder="Rank (e.g. 1st Place)" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={additionalDetails.college}
                      onChange={(e) => setAdditionalDetails({...additionalDetails, college: e.target.value})}
                      className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                      placeholder="College / Institution" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-authra-border-light dark:border-authra-border-dark">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative flex items-center justify-center w-5 h-5 border border-authra-border-light dark:border-authra-border-dark rounded-md group-hover:border-brand-steel transition-colors">
                  <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" defaultChecked />
                  <CheckCircle2 className="w-3 h-3 text-brand-steel opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark group-hover:text-authra-text-light dark:group-hover:text-white transition-colors">
                  Send email notification to recipients
                </span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30 flex items-center justify-end gap-4">
            <button className="px-6 py-2.5 rounded-full text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white transition-colors border border-transparent hover:border-authra-border-light dark:hover:border-authra-border-dark">
              Save Draft
            </button>
            <button 
              onClick={handleIssueCertificates}
              disabled={isIssuing || issueRecipients.filter(r => r.name && r.email).length === 0 || !additionalDetails.title.trim() || !additionalDetails.eventName.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIssuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isIssuing ? 'Issuing...' : `Issue ${issueRecipients.filter(r => r.name && r.email).length} Certificate${issueRecipients.filter(r => r.name && r.email).length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="flex-1 w-full bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm p-6 lg:sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-authra-text-light dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-steel" /> Live Preview
            </h3>
            <span className="text-xs bg-brand-steel/10 text-brand-steel px-2 py-1 rounded-md font-medium uppercase tracking-wider">
              Updates in Realtime
            </span>
          </div>
          
          <div className="w-full relative rounded-xl overflow-hidden shadow-xl border border-authra-border-light dark:border-authra-border-dark bg-[#0A0C10]">
            <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
              <foreignObject width="1000" height="772.72">
                <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                  {(() => {
                    const TemplateComponent = getTemplateComponent(selectedTemplate);
                    return <TemplateComponent data={previewData} />;
                  })()}
                </div>
              </foreignObject>
            </svg>
          </div>
          
          <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>The preview above shows the layout for the first recipient. The system will automatically generate identical certificates customized for each individual recipient upon issuance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
