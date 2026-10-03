"use client";

import React, { useState } from 'react';
import { EmailCard } from './EmailCard';
import { EmailViewer } from './EmailViewer';

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
}

export const LockOne = ({ emails, score, setScore, onSuccess, setTimerActive }: LockOneProps) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [wrongEmails, setWrongEmails] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  const handleStartLevel = () => {
    setStarted(true);
    setTimerActive(true);
  };

  const handleInspect = (id: string) => {
    setSelectedEmailId(id);
  };

  const handleMarkPhishing = () => {
    if (!selectedEmailId) return;

    const email = emails.find(e => e.id === selectedEmailId);
    if (email?.isPhishing) {
      onSuccess();
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setWrongEmails(prev => [...prev, selectedEmailId]);
      setSelectedEmailId(null);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Lock 1 — Phishing Detection
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            "The system has been hit by a phishing wave. Identify the malicious email to secure the gateway."
          </p>
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartLevel}
              className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-lg"
            >
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            onClick={() => handleInspect(email.id)}
            isWrong={wrongEmails.includes(email.id)}
          />
        ))}
      </div>

      {selectedEmailId && (
        <EmailViewer
          email={emails.find(e => e.id === selectedEmailId)!}
          onClose={() => setSelectedEmailId(null)}
          onMarkPhishing={handleMarkPhishing}
        />
      )}
    </>
  );
};
