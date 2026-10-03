import React from 'react';

interface GameOverScreenProps {
  onRestart: () => void;
}

export const GameOverScreen = ({ onRestart }: GameOverScreenProps) => (
  <div className="text-center space-y-8 animate-in zoom-in duration-500">
    <div className="text-7xl mb-4">⏱</div>
    <div className="space-y-2">
      <h2 className="text-5xl font-black text-red-500 uppercase italic tracking-tighter">
        Time's Up
      </h2>
    </div>
    <button
      onClick={onRestart}
      className="px-8 py-3 border border-red-500 text-red-500 font-bold rounded-full hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-sm"
    >
      Try Again
    </button>
  </div>
);
