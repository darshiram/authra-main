import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import horizontalLogo from '../../assets/horziontal logo.png';
import { QRCodeSVG } from 'qrcode.react';

export default function ExecutiveGlass({ data }) {
  const issuerName = data?.issuerName || "Global Finance Institute";
  const recipientName = data?.recipientName || "Alex Developer";
  const title = data?.title || "Cybersecurity Risk Management";
  const skills = data?.skills ? data.skills.split(',').map(s => s.trim()) : ['Risk Assessment', 'Compliance', 'Auditing'];
  const issueDate = data?.issueDate ? new Date(data.issueDate).toLocaleDateString() : "May 12, 2026";
  const credentialId = data?.credentialId || "AUT-8392-AB";

  // Create absolute URL for verification
  const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

  return (
    <div id={`cert-${credentialId}`} className="w-full max-w-[1000px] mx-auto aspect-[11/8.5] bg-[#0A1929] border border-white/10 rounded-xl shadow-2xl relative overflow-hidden flex flex-col p-12">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#0D253F] to-[#0A1929]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      
      {/* Subtle Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
      
      {/* Content Container with Glassmorphism */}
      <div className="relative z-10 flex-1 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-10 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-serif text-2xl text-white tracking-wide">{issuerName}</p>
              <p className="text-blue-300 text-xs tracking-widest uppercase mt-1">Excellence in Education</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <img src={horizontalLogo} alt="Authra" className="h-8 brightness-0 invert opacity-70" />
            <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" /> Official Record
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col justify-center text-center mt-8">
          <p className="text-blue-300 text-sm tracking-[0.4em] uppercase mb-6 font-medium">Certification of Completion</p>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-8 drop-shadow-md">
            {recipientName}
          </h1>
          <p className="text-white/60 text-sm tracking-widest uppercase mb-4">For achieving proficiency in</p>
          <h2 className="text-3xl font-medium text-blue-400 mb-8 tracking-wide">{title}</h2>
          
          <div className="flex justify-center gap-4">
            {skills.map((skill, index) => (
              <span key={index} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 text-xs tracking-wider">{skill}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12 pt-8 border-t border-white/10">
          <div className="flex gap-16 text-left">
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Granted On</p>
              <p className="text-white text-base tracking-wider">{issueDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Verify Credential</p>
              <p className="text-white text-base tracking-wider font-mono">{credentialId}</p>
            </div>
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <QRCodeSVG 
                value={verifyUrl} 
                size={96} 
                fgColor="#ffffff" 
                bgColor="transparent"
                level="M"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
