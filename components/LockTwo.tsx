"use client";

import React, { useState, useEffect } from 'react';

interface LockTwoProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
}

const LOCK_2_DEFAULT_HINTS = [
  "The first part is a word associated with computers, networks, and the digital world.",
  "The second part is a word for someone who protects something from danger.",
  "The password ends with the four-digit year 2026.",
  "Combine the first word, the second word, and the year together with no spaces."
];

const LOCK_2_EXTRA_HINT =
  "Think of a protector of the digital world.";

export const LockTwo = ({ score, setScore, onSuccess, currentLock }: LockTwoProps) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [extraHintRevealed, setExtraHintRevealed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedState = localStorage.getItem('the5locks-game-state');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.revealedExtraHints && state.revealedExtraHints[currentLock]) {
        setExtraHintRevealed(true);
      }
    }
  }, [currentLock]);

  const TARGET_PASSWORD = "CyberGuard2026";

  const handleGetExtraHint = () => {
    if (score < 10) {
      setError('NOT ENOUGH XP');
      return;
    }

    if (extraHintRevealed) return;

    setScore(prev => prev - 10);
    setExtraHintRevealed(true);
    setError('');

    const savedState = localStorage.getItem('the5locks-game-state');
    const state = savedState ? JSON.parse(savedState) : {};
    const revealedExtraHints = state.revealedExtraHints || {};
    revealedExtraHints[currentLock] = true;

    localStorage.setItem('the5locks-game-state', JSON.stringify({
      ...state,
      revealedExtraHints: revealedExtraHints
    }));
  };

  const handleVerify = () => {
    if (passwordInput === TARGET_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Access denied.');
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
      <div className="glass-panel p-8 rounded-2xl w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white italic uppercase tracking-tighter">
            Lock 2 — The Encrypted Vault
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            "The system is locked. Find the administrative password to bypass the security firewall."
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <input
            type="text"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter Password..."
            className="w-full max-w-xs bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-center focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            onClick={handleVerify}
            className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-sm"
          >
            Verify Access
          </button>
        </div>

        {error && (
          <p className="text-red-400 font-mono text-xs uppercase animate-pulse">
            {error}
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-3">
          <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-widest px-2">
            System Hints
          </h3>

          <div className="space-y-2">
            <p className="text-white font-mono text-xs uppercase tracking-tighter px-2 mb-1 opacity-70">
              💡 Default Hints
            </p>
            {LOCK_2_DEFAULT_HINTS.map((hint, idx) => (
              <div key={idx} className="text-gray-300 font-mono text-sm px-2 flex gap-2">
                <span className="text-cyan-400">{String(idx + 1).padStart(2, '0')}</span> {hint}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <p className="text-white font-mono text-xs uppercase tracking-tighter px-2 mb-1 opacity-70">
              🔎 Extra Hint
            </p>
            {extraHintRevealed ? (
              <div className="text-cyan-300 font-mono text-sm px-2 italic">
                {LOCK_2_EXTRA_HINT}
              </div>
            ) : (
              <div className="text-gray-500 font-mono text-xs px-2 italic">
                Ready for request.
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGetExtraHint}
              disabled={extraHintRevealed || score < 10}
              className={`text-xs font-mono border px-4 py-2 rounded transition-all uppercase tracking-widest ${
                extraHintRevealed
                  ? 'border-white/10 text-gray-600 cursor-not-allowed'
                  : score < 10
                    ? 'border-red-500/50 text-red-500 cursor-not-allowed'
                    : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {extraHintRevealed
                ? 'Extra Hint Used'
                : score < 10
                  ? 'Not Enough XP'
                  : 'Get Extra Hint (-10 XP)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
