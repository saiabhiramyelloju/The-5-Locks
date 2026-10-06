"use client";

import React from 'react';
import { SecurityCore } from './SecurityCore';

interface GameOverScreenProps {
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => (
  <div className="relative z-10 text-center space-y-6 max-w-md mx-auto px-4 py-8 animate-in zoom-in-95 duration-400">
    <div className="flex justify-center">
      <SecurityCore status="error" size="xl" withRings={true} />
    </div>

    <div className="space-y-2">
      <div className="inline-block px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-[10px] uppercase tracking-widest font-bold">
        CRITICAL TIMEOUT
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-rose-500 uppercase italic tracking-tighter drop-shadow-[0_0_25px_rgba(244,63,94,0.4)]">
        Time's Up
      </h2>
      <p className="text-gray-300 font-mono text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
        The defensive telemetry window expired before the system lockdown could be averted.
      </p>
    </div>

    <div className="pt-2">
      <button
        onClick={onRestart}
        className="py-3.5 px-8 rounded-full border-2 border-rose-500 bg-rose-950/40 text-white font-mono font-bold hover:bg-rose-600 transition-all uppercase tracking-widest text-xs shadow-lg shadow-rose-950/50 cursor-pointer"
      >
        Retry Sector Investigation
      </button>
    </div>
  </div>
);
