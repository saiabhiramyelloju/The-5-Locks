"use client";

import React, { useEffect, useRef, useState } from 'react';
import { SecurityCore, type SecurityStatus } from './SecurityCore';
import { animateCounter } from '../lib/anime';

interface GameHeaderProps {
  currentLock: number;
  score: number;
  timeRemaining: number;
  securityStatus?: SecurityStatus;
  statusLabel?: string;
  timerActive?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentLock,
  score,
  timeRemaining,
  securityStatus = 'idle',
  statusLabel,
  timerActive = false,
}) => {
  const [displayedScore, setDisplayedScore] = useState(score);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (prevScoreRef.current !== score) {
      animateCounter(prevScoreRef.current, score, (val) => {
        setDisplayedScore(val);
      }, 600);
      prevScoreRef.current = score;
    }
  }, [score]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timerActive && timeRemaining <= 20;

  return (
    <header className="w-full max-w-4xl mb-6">
      {/* Top SOC Status Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-xl">
        {/* Left: Branding & Current Lock */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase italic">
                The 5 Locks
              </h1>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-cyan-400/80 uppercase tracking-widest">
              SOC Challenge Gateway
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Current Sector</span>
            <span className="text-sm font-mono font-bold text-white">
              LOCK <span className="text-cyan-400">{currentLock}</span> / 5
            </span>
          </div>
        </div>

        {/* Center: Security Core Indicator */}
        <div className="flex items-center justify-center">
          <SecurityCore
            status={securityStatus}
            size="sm"
            showLabel={true}
            labelOverride={statusLabel}
          />
        </div>

        {/* Right: XP & Timer */}
        <div className="flex items-center gap-4 sm:gap-6 ml-auto sm:ml-0 font-mono">
          {/* XP Display */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Score</span>
            <div className="text-lg sm:text-xl font-black text-cyan-400 flex items-center gap-1">
              <span>{displayedScore}</span>
              <span className="text-xs text-cyan-400/70 font-normal">XP</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Timer Display */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              {timerActive ? 'Time Remaining' : 'Timer Ready'}
            </span>
            <div
              className={`text-lg sm:text-xl font-bold transition-colors ${
                isLowTime
                  ? 'text-rose-400 animate-pulse font-black'
                  : 'text-white'
              }`}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
