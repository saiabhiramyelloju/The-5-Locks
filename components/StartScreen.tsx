import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  onReset: () => void;
}

export const StartScreen = ({ onStart, onReset }: StartScreenProps) => (
  <div className="text-center space-y-12 animate-in fade-in duration-700">
    <div className="relative inline-block">
      <div className="text-8xl mb-4">🔐</div>
      <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
    </div>
    <div className="space-y-4">
      <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">
        The 5 Locks
      </h1>
      <p className="text-cyan-400 font-mono tracking-widest uppercase text-lg">
        A Cybersecurity Puzzle
      </p>
    </div>
    <div className="space-y-2 font-mono text-gray-400 uppercase tracking-tighter text-sm">
      <p>5 Locks.</p>
      <p>5 Challenges.</p>
      <p>Win the goodies</p>
    </div>
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onStart}
        className="px-12 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-lg"
      >
        Start Lock 1
      </button>
      <button
        onClick={onReset}
        className="text-gray-500 hover:text-red-400 font-mono text-xs uppercase tracking-widest transition-colors"
      >
        Reset Progress
      </button>
    </div>
  </div>
);
