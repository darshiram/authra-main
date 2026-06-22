import React from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getTemplateComponent, getDefaultTemplates } from '../certificate-templates/TemplateRegistry';

export default function TemplatesTab({
  user,
  settingsForm,
  setSelectedTemplate,
  setActiveTab,
  setShowRequestDesignModal
}) {
  const { showToast } = useToast();
  const templateData = { issuerName: settingsForm.name || user?.name || "Your Organization" };

  const defaultTemplates = getDefaultTemplates();
  const customTemplates = user?.customTemplates || [];
  const allTemplates = [...defaultTemplates, ...customTemplates];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
            Certificate Templates
          </h1>
          <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
            Manage your reusable credential designs.
          </p>
        </div>
        <button 
          onClick={() => {
            if (user?.plan === 'free') {
              showToast('Custom design requests are only available for paid organization accounts. Please upgrade your plan.', 'error');
            } else {
              setShowRequestDesignModal(true);
            }
          }}
          className="btn-primary w-fit flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Request Custom Design
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {allTemplates.map((template, index) => {
          const TemplateComponent = getTemplateComponent(template.id);
          let colorClass = "text-brand-steel";
          let bgClass = "bg-brand-steel/20";
          let btnClass = "bg-brand-steel hover:brightness-110";
          let borderClass = "border-authra-border-light dark:border-authra-border-dark";
          let shadowClass = "shadow-lg";
          
          if (template.id === 'cyberpunk') {
            colorClass = "text-purple-500";
            bgClass = "bg-purple-500/20";
            btnClass = "bg-purple-500 hover:bg-purple-600 shadow-purple-500/20";
            borderClass = "border-purple-500/20";
            shadowClass = "shadow-[0_0_30px_rgba(168,85,247,0.1)]";
          } else if (template.id === 'executive') {
            colorClass = "text-emerald-500";
            bgClass = "bg-emerald-500/20";
            btnClass = "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20";
            borderClass = "border-slate-700/50";
          } else if (template.id !== 'modern') {
            // Default for custom templates
            colorClass = "text-amber-500";
            bgClass = "bg-amber-500/20";
            btnClass = "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20";
          }

          return (
            <div key={template.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${bgClass} ${colorClass} flex items-center justify-center text-xs font-bold`}>{index + 1}</span>
                  <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">{template.name}</h2>
                  {template.id !== 'modern' && template.id !== 'cyberpunk' && template.id !== 'executive' && (
                     <span className="px-2 py-0.5 ml-2 text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">Custom</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedTemplate(template.id); setActiveTab('issue'); }} className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors shadow-lg ${btnClass}`}>Issue</button>
                </div>
              </div>
              
              <div className={`w-full relative rounded-xl overflow-hidden ${shadowClass} border ${borderClass} group bg-white dark:bg-[#0A0C10]`}>
                <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
                  <foreignObject width="1000" height="772.72">
                    <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                      <TemplateComponent data={templateData} />
                    </div>
                  </foreignObject>
                </svg>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
