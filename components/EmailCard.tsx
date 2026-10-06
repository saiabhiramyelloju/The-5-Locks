"use client";

import React from 'react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  isPhishing: boolean;
  timestamp?: string;
}

interface EmailCardProps {
  email: Email;
  onClick: () => void;
  isWrong?: boolean;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick, isWrong }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        cursor-pointer p-5 rounded-xl border transition-all duration-300 relative group
        glass-panel glass-panel-hover text-left flex flex-col justify-between min-h-[140px]
        ${isWrong ? 'border-rose-500/80 bg-rose-950/20 animate-shake' : 'border-white/10'}
        focus:outline-none focus:ring-2 focus:ring-cyan-400
      `}
    >
      {/* Top Header: Sender & Secure Status Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400/80 shrink-0" />
            <span className="font-mono text-xs text-gray-300 truncate font-semibold" title={email.sender}>
              {email.sender}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase shrink-0">
            INCOMING
          </span>
        </div>

        {/* Subject */}
        <h3 className="text-white font-medium text-sm sm:text-base line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {email.subject}
        </h3>
      </div>

      {/* Footer Info: Warning or Inspect action */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        {isWrong ? (
          <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
            <span>⚠</span> LEGITIMATE SENDER
          </span>
        ) : (
          <span className="text-[11px] font-mono text-gray-500">
            GATEWAY SCAN: PASS
          </span>
        )}

        <span className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded-md group-hover:bg-cyan-400 group-hover:text-black transition-all uppercase tracking-wider font-bold">
          INSPECT
        </span>
      </div>
    </div>
  );
};
