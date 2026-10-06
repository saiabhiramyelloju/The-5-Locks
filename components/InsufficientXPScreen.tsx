"use client";

import React from 'react';
import { SecurityCore } from './SecurityCore';

interface InsufficientXPScreenProps {
  onRestart: () => void;
}

export const InsufficientXPScreen: React.FC<InsufficientXPScreenProps> = ({ onRestart }) => (
  <div className="relative z-10 text-center space-y-6 max-w-md mx-auto px-4 py-8 animate-in zoom-in-95 duration-400">
    <div className="flex justify-center">
      <SecurityCore status="processing" size="xl" withRings={true} />
    </div>

    <div className="space-y-2">
      <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase tracking-widest font-bold">
        DEFENSE SCORE THRESHOLD UNMET
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-amber-400 uppercase italic tracking-tighter drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
        Almost There
      </h2>
      <p className="text-gray-300 font-mono text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
        You successfully breached all five locks, but accumulated too many security penalties during investigation.
      </p>
      <p className="text-white font-mono text-sm pt-2">
        Minimum Required for Full Clearance:{' '}
        <span className="text-amber-400 font-bold">450 XP</span>
      </p>
    </div>

    <div className="pt-2">
      <button
        onClick={onRestart}
        className="py-3.5 px-8 rounded-full border-2 border-amber-500 bg-amber-950/40 text-white font-mono font-bold hover:bg-amber-500 hover:text-black transition-all uppercase tracking-widest text-xs shadow-lg shadow-amber-950/50 cursor-pointer"
      >
        Try Again for Perfect Score
      </button>
    </div>
  </div>
);
