import React from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import ModernMinimalist from '../certificate-templates/ModernMinimalist';
import CyberpunkGrid from '../certificate-templates/CyberpunkGrid';
import ExecutiveGlass from '../certificate-templates/ExecutiveGlass';

export default function TemplatesTab({
  user,
  settingsForm,
  setSelectedTemplate,
  setActiveTab,
  setShowRequestDesignModal
}) {
  const { showToast } = useToast();
  const templateData = { issuerName: settingsForm.name || user?.name || "Your Organization" };

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
        
        {/* Template 1: Modern Minimalist */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-steel/20 text-brand-steel flex items-center justify-center text-xs font-bold">1</span>
              <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Modern Minimalist</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-brand-steel text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
              <button onClick={() => { setSelectedTemplate('modern'); setActiveTab('issue'); }} className="px-3 py-1.5 rounded-lg bg-brand-steel hover:brightness-110 text-white text-xs font-medium transition-colors">Issue</button>
            </div>
          </div>
          
          <div className="w-full relative rounded-xl overflow-hidden shadow-lg border border-authra-border-light dark:border-authra-border-dark group bg-white dark:bg-[#0A0C10]">
            <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
              <foreignObject width="1000" height="772.72">
                <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                  <ModernMinimalist data={templateData} />
                </div>
              </foreignObject>
            </svg>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
          </div>
        </div>

        {/* Template 2: Cyberpunk Hex */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold">2</span>
              <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Cyberpunk Grid</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-purple-500 hover:text-purple-500 text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
              <button onClick={() => { setSelectedTemplate('cyberpunk'); setActiveTab('issue'); }} className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors shadow-lg shadow-purple-500/20">Issue</button>
            </div>
          </div>
          
          <div className="w-full relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)] border border-purple-500/20 group bg-[#050505]">
            <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
              <foreignObject width="1000" height="772.72">
                <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                  <CyberpunkGrid data={templateData} />
                </div>
              </foreignObject>
            </svg>
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
          </div>
        </div>

        {/* Template 3: Executive Glass */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">3</span>
              <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Executive Glass</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-emerald-500 hover:text-emerald-500 text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
              <button onClick={() => { setSelectedTemplate('executive'); setActiveTab('issue'); }} className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-lg shadow-emerald-500/20">Issue</button>
            </div>
          </div>
          
          <div className="w-full relative rounded-xl overflow-hidden shadow-xl border border-slate-700/50 group bg-[#020617]">
            <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
              <foreignObject width="1000" height="772.72">
                <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                  <ExecutiveGlass data={templateData} />
                </div>
              </foreignObject>
            </svg>
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
