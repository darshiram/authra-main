import React from 'react';
import { Award, Hexagon, ShieldCheck } from 'lucide-react';
import horizontalLogo from '../../assets/horziontal logo.png';
import { QRCodeSVG } from 'qrcode.react';

export default function OrgCustom01({ data }) {
  const issuerName = data?.issuerName || "Authra Academy";
  const recipientName = data?.recipientName || "Alex Developer";
  const rawTitle = data && 'title' in data ? data.title : "Premium Full-Stack Engineering";
  const title = rawTitle;
  const rawEventName = data && 'eventName' in data ? data.eventName : "";
  const eventName = rawEventName;
  const rank = data?.rank || "";
  const rawSkills = data && 'skills' in data ? data.skills : 'React, Node.js, System Design, AWS';
  const skills = rawSkills ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const issueDate = data?.issueDate ? new Date(data.issueDate).toLocaleDateString() : "May 12, 2026";
  const credentialId = data?.credentialId || "AUT-9999-GLD";
  
  // Create absolute URL for verification
  const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

  return (
    <div id={`cert-${credentialId}`} className="w-full max-w-[1000px] mx-auto aspect-[11/8.5] bg-[#0A0C10] border-2 border-amber-500/50 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col p-12">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 opacity-50"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 opacity-50"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Hexagon className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
              {issuerName}
              {data?.issuerIsOfficial && <ShieldCheck className="w-4 h-4 text-amber-400" title="Official Verified Organization" />}
            </p>
            <p className="text-[10px] text-amber-500/70 uppercase tracking-widest">Issuing Organization</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <img src={horizontalLogo} alt="Authra" className="h-8 opacity-80" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-semibold uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <Award className="w-3 h-3" />
            Premium Verification
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center text-center z-10 mt-4">
        <p className="text-sm tracking-[0.3em] text-amber-500/60 uppercase mb-4">This certifies that</p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif tracking-wide" style={{ textShadow: '0 0 40px rgba(245,158,11,0.3)' }}>
          {recipientName}
        </h1>
        <p className="text-sm tracking-[0.3em] text-amber-500/60 uppercase mb-4">has successfully completed</p>
        <h2 className={`text-3xl md:text-4xl font-medium text-amber-400 ${eventName ? 'mb-2' : 'mb-8'}`}>{title}</h2>
        {eventName && (
          <p className="text-sm font-semibold text-white/60 tracking-widest uppercase mb-8">{eventName}</p>
        )}
        {rank && (
          <div className="flex justify-center mb-8">
            <span className="px-6 py-2 rounded-full border border-amber-400 bg-amber-500/20 text-amber-400 text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              {rank}
            </span>
          </div>
        )}
        
        <div className="flex justify-center flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-4 py-1.5 rounded-md bg-amber-500/5 border border-amber-500/20 text-xs font-medium text-amber-200">{skill}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 mt-8 border-t border-amber-500/20 pt-6">
        <div className="flex gap-12 text-left">
          <div>
            <p className="text-[10px] text-amber-500/60 uppercase tracking-wider mb-1">Issue Date</p>
            <p className="text-sm font-semibold text-white">{issueDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-amber-500/60 uppercase tracking-wider mb-1">Scan to Verify</p>
            <p className="text-sm font-mono font-semibold text-white">{credentialId}</p>
          </div>
          <div className="p-2 bg-white rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-200">
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
