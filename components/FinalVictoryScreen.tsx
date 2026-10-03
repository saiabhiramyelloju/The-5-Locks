"use client";

import React, { useState, useEffect } from 'react';

interface VictoryProps {
  score: number;
  onRestart: () => void;
}

export const FinalVictoryScreen = ({ score, onRestart }: VictoryProps) => {
  const [stage, setStage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev < 5) return prev + 1;
        setShowContent(true);
        return prev;
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-[540px] w-full px-4">
        {!showContent ? (
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="text-4xl animate-bounce">🎉</div>
            <div className="grid grid-cols-1 gap-2 font-mono">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`text-lg transition-all duration-500 ${stage >= num ? 'text-green-400 opacity-100 scale-105' : 'text-gray-600 opacity-50 scale-100'}`}
                >
                  LOCK {num} {stage >= num ? '🔓' : '🔐'}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter animate-pulse">
              Unlocking System...
            </h2>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in duration-700">
            <div className="space-y-2">
              <div className="text-4xl animate-bounce">🎉</div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                Mission<br />Complete
              </h1>
              <h2 className="text-lg md:text-xl font-bold text-cyan-400 uppercase tracking-widest font-mono">
                The 5 Locks
              </h2>
            </div>

            <div className="space-y-1">
              <p className="text-green-400 font-mono text-sm uppercase tracking-widest">
                All Five Locks Breached
              </p>
              <p className="text-white font-mono text-xs opacity-80">
                Cyber System Secured
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-mono">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="text-green-400">✓ LOCK {i}</span>
              ))}
            </div>

            <div className="glass-panel p-4 rounded-2xl inline-block space-y-1 min-w-[200px] max-w-full">
              <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest">Final Score</p>
              <div className="text-2xl font-black text-white font-mono">
                {score} <span className="text-sm text-cyan-400">XP</span>
              </div>
              <p className="text-cyan-400 font-mono text-[10px] uppercase animate-pulse">
                You secured the system.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onRestart}
                className="px-6 py-2 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
