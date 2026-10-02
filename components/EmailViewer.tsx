import React from 'react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  message: string;
  isPhishing: boolean;
}

interface EmailViewerProps {
  email: Email;
  onClose: () => void;
  onMarkPhishing: () => void;
}

export const EmailViewer = ({ email, onClose, onMarkPhishing }: EmailViewerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-mono text-cyan-400">MESSAGE INSPECTION</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-500 uppercase">From</p>
            <p className="text-white font-mono">{email.sender}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-500 uppercase">Subject</p>
            <p className="text-white text-lg">{email.subject}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-500 uppercase">Message</p>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {email.message}
            </div>
          </div>
          {email.id === 'phish' && (
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors uppercase tracking-widest text-sm">
              Verify Account
            </button>
          )}
        </div>
        <div className="p-6 bg-white/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-mono text-sm"
          >
            CLOSE
          </button>
          <button
            onClick={onMarkPhishing}
            className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-mono text-sm font-bold"
          >
            MARK AS PHISHING
          </button>
        </div>
      </div>
    </div>
  );
};
