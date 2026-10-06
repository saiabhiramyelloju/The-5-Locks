"use client";

import React, { useEffect } from 'react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  message: string;
  isPhishing: boolean;
}

interface EmailViewerProps {
  email: Email | undefined;
  onClose: () => void;
  onMarkPhishing: () => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({ email, onClose, onMarkPhishing }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-viewer-title"
      >
        {/* Terminal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 id="email-viewer-title" className="text-sm sm:text-base font-mono text-cyan-400 font-bold uppercase tracking-wider">
              GATEWAY DEEP PACKET INSPECTION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close message inspection"
          >
            &times;
          </button>
        </div>

        {/* Message Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto font-mono text-sm">
          {/* Metadata Triage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
            <div>
              <span className="text-gray-500 uppercase block text-[10px]">Sender Address</span>
              <span className="text-white font-semibold select-all break-all">{email.sender}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase block text-[10px]">Routing Verification</span>
              <span className="text-cyan-400 font-semibold">TLS 1.3 / INSPECTED</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Subject</p>
            <p className="text-white text-base font-sans font-bold">{email.subject}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Decoded Payload Body</p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-gray-300 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap select-text selection:bg-cyan-500/30 selection:text-white">
              {email.message}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
            <span>ℹ</span>
            <span>Check sender domain authenticity, URLs, and urgency cues before classifying.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
          >
            Return to Gateway
          </button>
          <button
            onClick={onMarkPhishing}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all font-mono text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⚠</span>
            <span>MARK AS PHISHING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
