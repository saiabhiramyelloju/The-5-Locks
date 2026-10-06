"use client";

import React from 'react';

interface LockProgressProps {
  currentLock: number;
}

const LOCK_TITLES = [
  'Lock 1: Phishing Triage',
  'Lock 2: Encrypted Vault',
  'Lock 3: Malware Trap',
  'Lock 4: Firewall NOC',
  'Lock 5: System Recovery',
];

export const LockProgress: React.FC<LockProgressProps> = ({ currentLock }) => {
  const locks = [1, 2, 3, 4, 5];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 select-none">
      <div className="flex items-center justify-between relative px-2">
        {locks.map((lock, index) => {
          const isCompleted = lock < currentLock;
          const isCurrent = lock === currentLock;
          const isLocked = lock > currentLock;

          return (
            <React.Fragment key={lock}>
              {/* Lock Node */}
              <div
                className="flex flex-col items-center gap-1.5 relative group"
                title={LOCK_TITLES[lock - 1]}
              >
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-500
                    ${
                      isCompleted
                        ? 'bg-emerald-950/60 border border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                        : isCurrent
                        ? 'bg-cyan-950/60 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110 ring-4 ring-cyan-500/20'
                        : 'bg-black/40 border border-white/10 text-gray-500 opacity-60'
                    }
                  `}
                >
                  {isCompleted ? (
                    <span className="text-base sm:text-lg animate-in zoom-in duration-300">✓</span>
                  ) : isCurrent ? (
                    <span className="text-base sm:text-lg animate-pulse">🔓</span>
                  ) : (
                    <span className="text-sm sm:text-base">🔒</span>
                  )}
                </div>

                {/* Subtitle label */}
                <span
                  className={`
                    font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors
                    ${
                      isCompleted
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-cyan-300 font-bold'
                        : 'text-gray-600'
                    }
                  `}
                >
                  L{lock}
                </span>

                {/* Hover Tooltip */}
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-gray-300 pointer-events-none whitespace-nowrap z-20">
                  {LOCK_TITLES[lock - 1]}
                </div>
              </div>

              {/* Connecting line between nodes */}
              {index < locks.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 sm:mx-2 relative overflow-hidden bg-white/10 rounded-full">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      lock < currentLock
                        ? 'w-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : lock === currentLock - 1
                        ? 'w-1/2 bg-cyan-400'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
