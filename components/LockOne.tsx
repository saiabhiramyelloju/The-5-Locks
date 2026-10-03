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
}

export const LockOne = ({ emails, score, setScore, onSuccess }: LockOneProps) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [wrongEmails, setWrongEmails] = useState<string[]>([]);

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
