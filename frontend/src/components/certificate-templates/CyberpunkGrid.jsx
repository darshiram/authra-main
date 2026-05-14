import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import horizontalLogo from '../../assets/horziontal logo.png';
import { QRCodeSVG } from 'qrcode.react';

export default function CyberpunkGrid({ data }) {
  const issuerName = data?.issuerName || "NeuroNet Systems";
  const recipientName = data?.recipientName || "Alex Developer";
  const title = data?.title || "Cloud Native Architecture";
  const skills = data?.skills ? data.skills.split(',').map(s => s.trim()) : ['Kubernetes', 'Docker', 'Go', 'gRPC'];
  const issueDate = data?.issueDate ? new Date(data.issueDate).toLocaleDateString() : "2026.05.12";
  const credentialId = data?.credentialId || "AUT-8392-AB";

  // Create absolute URL for verification
  const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

  return (
    <div id={`cert-${credentialId}`} className="w-full max-w-[1000px] mx-auto aspect-[11/8.5] bg-[#050505] border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col p-12 font-mono">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Glow Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 border-b border-cyan-500/30 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50 relative">
            <div className="absolute inset-0 border border-cyan-500 blur-sm"></div>
            <Activity className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="font-bold text-xl text-cyan-50 tracking-wider">{issuerName}</p>
            <p className="text-xs text-cyan-500 tracking-[0.2em] mt-1">NODE_AUTHORITY_VERIFIED</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <img src={horizontalLogo} alt="Authra" className="h-8 brightness-0 invert opacity-90" />
          <div className="flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/50 text-fuchsia-400 text-[10px] uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Blockchain Secured
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center z-10 mt-8 relative">
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>

        <div className="px-12 py-8">
          <p className="text-cyan-600 tracking-[0.4em] text-xs mb-6">INITIATING_CREDENTIAL_TRANSFER</p>
          <p className="text-cyan-400 tracking-[0.2em] text-sm mb-2">TARGET_ENTITY:</p>
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-50 tracking-wider mb-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            {recipientName}
          </h1>
          <p className="text-cyan-400 tracking-[0.2em] text-sm mb-2">ACHIEVEMENT_UNLOCKED:</p>
          <h2 className="text-3xl font-bold text-fuchsia-400 mb-8 uppercase tracking-widest">{title}</h2>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-cyan-950/50 border border-cyan-800 text-cyan-300 text-xs tracking-widest uppercase">[{skill}]</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 mt-8 pt-6 border-t border-cyan-500/30">
        <div className="flex gap-16 text-left">
          <div>
            <p className="text-cyan-600 text-[10px] tracking-widest mb-1">TIMESTAMP</p>
            <p className="text-cyan-50 text-sm tracking-wider">{issueDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-cyan-600 text-[10px] tracking-widest mb-1">SCAN_TO_VERIFY</p>
            <p className="text-cyan-50 text-sm tracking-wider">{credentialId}</p>
          </div>
          <div className="p-2 bg-cyan-950 border border-cyan-500/50">
            <QRCodeSVG 
              value={verifyUrl} 
              size={84} 
              fgColor="#22d3ee" 
              bgColor="transparent"
              level="M"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
