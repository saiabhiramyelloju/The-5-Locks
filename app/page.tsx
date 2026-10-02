"use client";

import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { GameHeader } from '../components/GameHeader';
import { LockProgress } from '../components/LockProgress';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Timer } from '../components/Timer';
import { EmailCard } from '../components/EmailCard';
import { EmailViewer } from '../components/EmailViewer';
import { HintButton } from '../components/HintButton';
import { SuccessScreen } from '../components/SuccessScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import { StartScreen } from '../components/StartScreen';
import { ThemeToggle } from '../components/ThemeToggle';

interface Email {
  id: string;
  sender: string;
  subject: string;
  message: string;
  isPhishing: boolean;
}

const EMAILS: Email[] = [
  {
    id: '1',
    sender: 'library@vbit.ac.in',
    subject: 'Library Timing Update',
    message: 'Dear Students,\n\nThe library will remain open until 8:00 PM during examination week.\n\nRegards,\nCentral Library',
    isPhishing: false,
  },
  {
    id: 'phish',
    sender: 'security@micros0ft-support.com',
    subject: 'URGENT: Your account will be deleted today',
    message: 'Your account has been flagged for suspicious activity.\n\nYour account will be permanently deleted unless you verify your identity immediately.\n\nClick below to verify your account.',
    isPhishing: true,
  },
  {
    id: '2',
    sender: 'events@vbit.ac.in',
    subject: 'Cybersecurity Workshop Registration',
    message: 'Your registration for the cybersecurity workshop has been confirmed.\n\nVenue: Seminar Hall\n\nTime: 10:00 AM',
    isPhishing: false,
  },
  {
    id: '3',
    sender: 'canteen@vbit.ac.in',
    subject: "Today's Menu",
    message: "Today's lunch menu:\n\nVeg Biryani\nPaneer Curry\nFresh Juice",
    isPhishing: false,
  },
];

type GameState = 'start' | 'playing' | 'success' | 'timeout' | 'complete';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [hintUsed, setHintUsed] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [wrongEmails, setWrongEmails] = useState<string[]>([]);

  useEffect(() => {
    // Subtle entry animation for the whole game
    anime({
      targets: '.cyber-grid',
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'playing') {
      setGameState('timeout');
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  const handleStart = () => {
    setGameState('playing');
    setScore(100);
    setTimeRemaining(60);
    setHintUsed(false);
    setWrongEmails([]);
  };

  const handleInspect = (id: string) => {
    setSelectedEmailId(id);
  };

  const handleMarkPhishing = () => {
    if (!selectedEmailId) return;

    const email = EMAILS.find(e => e.id === selectedEmailId);
    if (email?.isPhishing) {
      setGameState('success');
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setWrongEmails(prev => [...prev, selectedEmailId]);
      setSelectedEmailId(null);
    }
  };

  const handleUseHint = () => {
    setScore(prev => Math.max(0, prev - 25));
    setHintUsed(true);
  };

  const handleContinue = () => {
    setGameState('complete');
  };

  const handleRestart = () => {
    setGameState('start');
  };

  if (gameState === 'start') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="start-screen-container scale-95 opacity-0">
          <StartScreen onStart={handleStart} />
        </div>
      </main>
    );
  }

  if (gameState === 'timeout') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <GameOverScreen onRestart={handleRestart} />
      </main>
    );
  }

  if (gameState === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <SuccessScreen score={score} onRestart={handleContinue} />
      </main>
    );
  }

  if (gameState === 'complete') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <div className="text-center space-y-8 animate-in zoom-in duration-500">
          <div className="text-7xl mb-4">🔐</div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
            Lock 1 Complete
          </h2>
          <p className="text-green-400 font-mono tracking-widest uppercase">
            You identified the phishing attack.
          </p>
          <div className="text-3xl font-mono text-white">
            +{score} XP
          </div>
          <div className="glass-panel p-8 rounded-xl max-w-md mx-auto space-y-6">
            <div className="text-center">
              <p className="text-gray-400 font-mono text-sm uppercase mb-2">Next Challenge</p>
              <h3 className="text-2xl font-bold text-white mb-4">Lock 2</h3>
              <p className="text-red-400 font-mono text-xs uppercase animate-pulse">Coming Soon</p>
            </div>
            <button
              onClick={handleRestart}
              className="w-full py-3 border border-white/20 text-white font-mono text-sm hover:bg-white/10 transition-colors uppercase tracking-widest"
            >
              Play Lock 1 Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 cyber-grid relative">
      <div className="absolute inset-0 theme-overlay pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <GameHeader />
        <LockProgress currentLock={1} />

        <div className="flex justify-between w-full max-w-2xl mb-8 font-mono">
          <ScoreDisplay score={score} />
          <Timer timeRemaining={timeRemaining} />
        </div>

        <div className="glass-panel p-6 rounded-2xl w-full max-w-2xl mb-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white italic uppercase">
            Lock 1 — The Phishing Trap
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            "Someone is trying to trick you into giving away your credentials.
            Find the phishing attempt among the arrivals."
          </p>
          <div className="pt-4">
            <span className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded uppercase tracking-widest">
              Objective: Find the phishing message
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {EMAILS.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onClick={() => handleInspect(email.id)}
              isWrong={wrongEmails.includes(email.id)}
            />
          ))}
        </div>

        <div className="mt-12">
          <HintButton
            onUseHint={handleUseHint}
            hintUsed={hintUsed}
            hintText="Pay close attention to the sender's domain. Is the company name spelled exactly as expected?"
          />
        </div>
      </div>

      {selectedEmailId && (
        <EmailViewer
          email={EMAILS.find(e => e.id === selectedEmailId)!}
          onClose={() => setSelectedEmailId(null)}
          onMarkPhishing={handleMarkPhishing}
        />
      )}
    </main>
  );
}
