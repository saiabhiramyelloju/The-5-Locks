import React from 'react';

interface SuccessScreenProps {
  score: number;
  onRestart: () => void;
}

export const SuccessScreen = ({ score, onRestart }: SuccessScreenProps) => (
  <div className="text-center space-y-8 animate-in zoom-in duration-500">
    <div className="relative inline-block">
      <div className="text-7xl mb-4">🔓</div>
      <div className="absolute -inset-4 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
    </div>
    <div className="space-y-2">
      <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
        Lock Breached
      </h2>
      <p className="text-green-400 font-mono tracking-widest uppercase">
        Phishing Attack Detected
      </p>
    </div>
    <div className="text-3xl font-mono text-white">
      +{score} XP
    </div>
    <div className="glass-panel p-6 rounded-xl max-w-md mx-auto text-left space-y-4">
      <h3 className="text-cyan-400 font-bold uppercase text-sm font-mono">Security Analysis:</h3>
      <p className="text-gray-300 text-sm leading-relaxed">
        The sender used a lookalike domain: <span className="text-red-400 font-mono">"micros0ft-support.com"</span>.
        Attackers often use fake domains and a sense of urgency to trick users into revealing sensitive information.
      </p>
    </div>
    <button
      onClick={onRestart}
      className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-sm"
    >
      Continue
    </button>
  </div>
);
