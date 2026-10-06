"use client";

import React, { useState } from 'react';
import { EmailCard } from './EmailCard';
import { EmailViewer } from './EmailViewer';
import { SecurityCore, type SecurityStatus } from './SecurityCore';

interface Email {
  id: string;
  sender: string;
  subject: string;
  message: string;
  isPhishing: boolean;
}

interface LockOneProps {
  emails: Email[];
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onStatusChange?: (status: SecurityStatus) => void;
}

export const LockOne: React.FC<LockOneProps> = ({
  emails,
  score,
  setScore,
  onSuccess,
  setTimerActive,
  onStatusChange,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [wrongEmails, setWrongEmails] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [localStatus, setLocalStatus] = useState<SecurityStatus>('idle');

  const handleStartLevel = () => {
    setStarted(true);
    setTimerActive(true);
    setLocalStatus('analyzing');
    onStatusChange?.('analyzing');
  };

  const handleInspect = (id: string) => {
    setSelectedEmailId(id);
    setLocalStatus('analyzing');
    onStatusChange?.('analyzing');
  };

  const handleMarkPhishing = () => {
    if (!selectedEmailId) return;

    const email = emails.find((e) => e.id === selectedEmailId);
    if (email?.isPhishing) {
      setLocalStatus('success');
      onStatusChange?.('success');
      onSuccess();
    } else {
      setScore((prev) => Math.max(0, prev - 10));
      setWrongEmails((prev) => [...prev, selectedEmailId]);
      setSelectedEmailId(null);
      setLocalStatus('error');
      onStatusChange?.('error');

      setTimeout(() => {
        setLocalStatus('analyzing');
        onStatusChange?.('analyzing');
      }, 2500);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center space-y-6 w-full relative overflow-hidden border border-white/10">
          <div className="flex justify-center mb-2">
            <SecurityCore status="idle" size="lg" withRings={true} />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase tracking-widest">
              Lock 1 / Sector 01
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              Phishing Detection
            </h2>
          </div>

          <p className="text-gray-300 font-mono text-sm max-w-md mx-auto leading-relaxed">
            "The perimeter gateway has intercepted a suspicious inbound wave. Identify the malicious email to secure the gateway."
          </p>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartLevel}
              className="py-4 px-10 cyber-btn-primary rounded-full text-sm font-black tracking-widest shadow-xl cursor-pointer"
            >
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
      {/* Sector Header bar */}
      <div className="w-full flex items-center justify-between px-2 font-mono text-xs text-gray-400">
        <span className="flex items-center gap-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          MAIL GATEWAY TRIAGE TERMINAL
        </span>
        <span>SELECT EMAIL TO INSPECT HEADERS</span>
      </div>

      {/* Email Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            onClick={() => handleInspect(email.id)}
            isWrong={wrongEmails.includes(email.id)}
          />
        ))}
      </div>

      {/* Message Inspection Modal */}
      {selectedEmailId && (
        <EmailViewer
          email={emails.find((e) => e.id === selectedEmailId)}
          onClose={() => setSelectedEmailId(null)}
          onMarkPhishing={handleMarkPhishing}
        />
      )}
    </div>
  );
};
