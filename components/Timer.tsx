"use client";

import React from 'react';

interface TimerProps {
  timeRemaining: number;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
  const seconds = timeRemaining % 60;
  const minutes = Math.floor(timeRemaining / 60);
  const isLowTime = timeRemaining <= 20;

  return (
    <div
      className={`font-mono text-sm sm:text-base font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border transition-colors ${
        isLowTime
          ? 'border-rose-500/50 text-rose-400 animate-pulse'
          : 'border-white/10 text-white'
      }`}
    >
      <span className="text-[10px] text-gray-500 uppercase">TIME</span>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
