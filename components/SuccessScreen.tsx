import React from 'react';

export interface CompletionData {
  title: string;
  subtitle: string;
  analysis: string;
  reward: number;
}

export const LOCK_COMPLETION_DATA: Record<number, CompletionData> = {
  1: {
    title: "LOCK BREACHED",
    subtitle: "PHISHING ATTACK DETECTED",
    analysis: "The sender used a lookalike domain. Attackers often use fake domains and a sense of urgency to trick users into revealing sensitive information.",
    reward: 100
  },
  2: {
    title: "LOCK BREACHED",
    subtitle: "VAULT ACCESS GRANTED",
    analysis: "You successfully reconstructed the administrative password by analyzing the provided encrypted clues and combining the digital components.",
    reward: 100
  },
  3: {
    title: "LOCK BREACHED",
    subtitle: "THREAT CONTAINED",
    analysis: "By analyzing file metadata and signatures, you correctly identified a malicious executable from an unverified external source and quarantined it.",
    reward: 100
  },
  // Lock 4 and 5 will be added when implemented
};

interface SuccessScreenProps {
  completedLock: number;
  onRestart: () => void;
}

export const SuccessScreen = ({ completedLock, onRestart }: SuccessScreenProps) => {
  const data = LOCK_COMPLETION_DATA[completedLock];

  if (!data) {
    return null;
  }

  return (
    <div className="text-center space-y-8 animate-in zoom-in duration-500">
      <div className="relative inline-block">
        <div className="text-7xl mb-4">🔓</div>
        <div className="absolute -inset-4 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
          {data.title}
        </h2>
        <p className="text-green-400 font-mono tracking-widest uppercase">
          {data.subtitle}
        </p>
      </div>
      <div className="text-3xl font-mono text-white">
        +{data.reward} XP
      </div>
      <div className="glass-panel p-6 rounded-xl max-w-md mx-auto text-left space-y-4">
        <h3 className="text-cyan-400 font-bold uppercase text-sm font-mono">Security Analysis:</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {data.analysis}
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
};
