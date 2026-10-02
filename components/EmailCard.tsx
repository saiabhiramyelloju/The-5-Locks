import React from 'react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  isPhishing: boolean;
}

interface EmailCardProps {
  email: Email;
  onClick: () => void;
  isWrong?: boolean;
}

export const EmailCard = ({ email, onClick, isWrong }: EmailCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-lg border transition-all duration-300
        glass-panel hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98]
        ${isWrong ? 'border-red-500 animate-shake' : 'border-white/10'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${email.isPhishing ? 'bg-red-500' : 'bg-green-500'} opacity-0`}></div>
        <span className="font-mono text-xs text-gray-400 truncate">{email.sender}</span>
      </div>
      <h3 className="text-white font-medium truncate mb-4">{email.subject}</h3>
      <div className="text-right">
        <span className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded hover:bg-cyan-400/10 transition-colors">
          INSPECT
        </span>
      </div>
    </div>
  );
};
