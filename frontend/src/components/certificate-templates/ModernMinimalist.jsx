import React from 'react';
import { ShieldCheck, Hexagon } from 'lucide-react';
import horizontalLogo from '../../assets/horziontal logo.png';
import { QRCodeSVG } from 'qrcode.react';

export default function ModernMinimalist({ data }) {
  const issuerName = data?.issuerName || "TechCorp Academy";
  const recipientName = data?.recipientName || "Alex Developer";
  const title = data?.title || "Advanced Full-Stack Engineering";
  const skills = data?.skills ? data.skills.split(',').map(s => s.trim()) : ['React', 'Node.js', 'System Design', 'AWS'];
  const issueDate = data?.issueDate ? new Date(data.issueDate).toLocaleDateString() : "May 12, 2026";
  const credentialId = data?.credentialId || "AUT-8392-AB";
  
  // Create absolute URL for verification
  const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

  return (
    <div id={`cert-${credentialId}`} className="w-full max-w-[1000px] mx-auto aspect-[11/8.5] bg-white dark:bg-[#0A0C10] border border-authra-border-light dark:border-[#2A3155] rounded-xl shadow-2xl relative overflow-hidden flex flex-col p-12">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-steel/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        {/* Issuer Logo placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10">
            <Hexagon className="w-6 h-6 text-brand-steel" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight tracking-tight text-authra-text-light dark:text-white">{issuerName}</p>
            <p className="text-[10px] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-widest">Issuing Organization</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <img src={horizontalLogo} alt="Authra" className="h-8 opacity-80" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-steel/30 bg-brand-steel/10 text-brand-ice text-[10px] font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Verified Credential
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center text-center z-10 mt-4">
        <p className="text-sm tracking-[0.3em] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase mb-4">This certifies that</p>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 mb-6 font-serif">
          {recipientName}
        </h1>
        <p className="text-sm tracking-[0.3em] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase mb-4">has successfully completed</p>
        <h2 className="text-3xl md:text-4xl font-medium text-brand-steel mb-8">{title}</h2>
        
        <div className="flex justify-center flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-authra-text-light dark:text-white">{skill}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 mt-8 border-t border-black/5 dark:border-white/5 pt-6">
        <div className="flex gap-12 text-left">
          <div>
            <p className="text-[10px] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-wider mb-1">Issue Date</p>
            <p className="text-sm font-semibold text-authra-text-light dark:text-white">{issueDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-authra-text-sec-light dark:text-[#9AA8D6] uppercase tracking-wider mb-1">Scan to Verify</p>
            <p className="text-sm font-mono font-semibold text-authra-text-light dark:text-white">{credentialId}</p>
          </div>
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <QRCodeSVG 
              value={verifyUrl} 
              size={84} 
              fgColor="#000000" 
              bgColor="#ffffff"
              level="M"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
