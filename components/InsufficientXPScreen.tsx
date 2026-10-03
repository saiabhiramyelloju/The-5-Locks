"use client";

import React from 'react';

interface InsufficientXPScreenProps {
  onRestart: () => void;
}

export const InsufficientXPScreen = ({ onRestart }: InsufficientXPScreenProps) => (
  <div className="text-center space-y-8 animate-in zoom-in duration-500">
    <div className="text-7xl mb-4">📉</div>
    <div className="space-y-2">
      <h2 className="text-5xl font-black text-yellow-500 uppercase italic tracking-tighter">
        Almost There
      </h2>
      <p className="text-gray-400 font-mono text-sm uppercase tracking-widest max-w-xs mx-auto">
        You breached all five locks, but your security rating is too low.
      </p>
      <p className="text-white font-mono text-lg">
        Required: <span className="text-yellow-500">450 XP</span>
      </p>
    </div>
    <button
      onClick={onRestart}
      className="px-8 py-3 border border-yellow-500 text-yellow-500 font-bold rounded-full hover:bg-yellow-500 hover:text-black transition-all uppercase tracking-widest text-sm"
    >
      Try Again
    </button>
  </div>
);
