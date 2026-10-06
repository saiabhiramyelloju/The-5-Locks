"use client";

import React, { useState, useEffect } from 'react';
import { SecurityCore, type SecurityStatus } from './SecurityCore';

interface LockTwoProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onStatusChange?: (status: SecurityStatus) => void;
}

const LOCK_2_DEFAULT_HINTS = [
  "The first part is a word associated with computers, networks, and the digital world.",
  "The second part is a word for someone who protects something from danger.",
  "The password ends with the four-digit year 2026.",
  "Combine the first word, the second word, and the year together with no spaces.",
];

const LOCK_2_EXTRA_HINT = "Think of a protector of the digital world.";

export const LockTwo: React.FC<LockTwoProps> = ({
  score,
  setScore,
  onSuccess,
  currentLock,
  setTimerActive,
  onStatusChange,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [extraHintRevealed, setExtraHintRevealed] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [localStatus, setLocalStatus] = useState<SecurityStatus>('idle');

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('the5locks-game-state');
      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.revealedExtraHints && state.revealedExtraHints[currentLock]) {
          setExtraHintRevealed(true);
        }
      }
    } catch (e) {
      console.warn('Error reading hint state:', e);
    }
  }, [currentLock]);

  const TARGET_PASSWORD = "CyberGuard2026";

  const handleStartLevel = () => {
    setStarted(true);
    setTimerActive(true);
    setLocalStatus('reasoning');
    onStatusChange?.('reasoning');
  };

  const handleGetExtraHint = () => {
    if (score < 10) {
      setError('INSUFFICIENT XP TO DECRYPT HINT');
      return;
    }

    if (extraHintRevealed) return;

    setScore((prev) => prev - 10);
    setExtraHintRevealed(true);
    setError('');

    try {
      const savedState = localStorage.getItem('the5locks-game-state');
      const state = savedState ? JSON.parse(savedState) : {};
      const revealedExtraHints = state.revealedExtraHints || {};
      revealedExtraHints[currentLock] = true;

      localStorage.setItem(
        'the5locks-game-state',
        JSON.stringify({
          ...state,
          score: score - 10,
          revealedExtraHints,
        })
      );
    } catch (e) {
      console.warn('Error updating hint state:', e);
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passwordInput.trim() === TARGET_PASSWORD) {
      setError('');
      setLocalStatus('success');
      onStatusChange?.('success');
      onSuccess();
    } else {
      setScore((prev) => Math.max(0, prev - 10));
      setError('INCORRECT CREDENTIAL: ACCESS DENIED (-10 XP)');
      setLocalStatus('error');
      onStatusChange?.('error');

      setTimeout(() => {
        setLocalStatus('reasoning');
        onStatusChange?.('reasoning');
      }, 2500);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center space-y-6 w-full relative overflow-hidden border border-white/10">
          <div className="flex justify-center mb-2">
            <SecurityCore status="idle" size="lg" withRings={true} />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-400/40 text-indigo-300 font-mono text-[10px] uppercase tracking-widest">
              Lock 2 / Sector 02
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              The Encrypted Vault
            </h2>
          </div>

          <p className="text-gray-300 font-mono text-sm max-w-md mx-auto leading-relaxed">
            "The system is locked behind a cryptographic challenge. Reconstruct the administrative master password to bypass the vault containment."
          </p>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartLevel}
              className="py-4 px-10 cyber-btn-primary rounded-full text-sm font-black tracking-widest shadow-xl cursor-pointer"
            >
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
      {/* Encrypted Vault Dial Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl w-full text-center space-y-6 relative overflow-hidden border border-indigo-500/30 shadow-2xl">
        {/* Subtle decorative cipher background elements */}
        <div className="absolute top-2 left-4 font-mono text-[10px] text-indigo-400/30 uppercase pointer-events-none">
          CIPHER: AES-256-GCM // HASH: SHA-256
        </div>
        <div className="absolute top-2 right-4 font-mono text-[10px] text-indigo-400/30 uppercase pointer-events-none">
          PORT: 8443 [ENCRYPTED]
        </div>

        {/* Central Vault Core with Thinking Orb */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative p-6 rounded-full border border-dashed border-indigo-500/30 mb-2">
            <div className="absolute inset-0 rounded-full border border-dotted border-white/10 animate-spin pointer-events-none" style={{ animationDuration: '30s' }} />
            <SecurityCore
              status={localStatus}
              size="lg"
              withRings={true}
              showLabel={true}
              labelOverride="VAULT REASONING CORE"
            />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-3">
            Administrative Vault Access
          </h2>
          <p className="text-gray-400 font-mono text-xs max-w-md mx-auto mt-1">
            Synthesize the target cryptographic key from the decrypted hints below.
          </p>
        </div>

        {/* Key Verification Form */}
        <form onSubmit={handleVerify} className="flex flex-col items-center gap-4 py-2">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter reconstructed password..."
              autoComplete="off"
              className="w-full bg-black/60 border border-white/20 rounded-xl px-5 py-3.5 text-white font-mono text-center tracking-wider focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm sm:text-base selection:bg-indigo-500/30"
            />
          </div>

          <button
            type="submit"
            className="px-10 py-3.5 cyber-btn-primary rounded-full text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer"
          >
            Verify Access Key
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 font-mono text-xs uppercase animate-shake">
            {error}
          </div>
        )}
      </div>

      {/* Hints System (STRICTLY LEVEL 2 ONLY) */}
      <div className="w-full space-y-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span>💡</span>
              <span>DECRYPTED SYSTEM HINTS</span>
            </h3>
            <span className="font-mono text-[10px] text-gray-500">4 DEFAULT ACTIVE</span>
          </div>

          <div className="space-y-2.5">
            {LOCK_2_DEFAULT_HINTS.map((hint, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 border border-white/5 text-gray-300 font-mono text-xs sm:text-sm flex items-start gap-3"
              >
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="leading-relaxed">{hint}</span>
              </div>
            ))}
          </div>

          {/* Extra Hint Section */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-indigo-300 font-bold uppercase flex items-center gap-1.5">
                <span>🔎</span> EXTRA SATELLITE HINT
              </span>
              <span className="font-mono text-[10px] text-gray-500">COST: 10 XP</span>
            </div>

            {extraHintRevealed ? (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-400/40 text-indigo-200 font-mono text-sm italic animate-in fade-in duration-300">
                "{LOCK_2_EXTRA_HINT}"
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-dashed border-white/10">
                <span className="font-mono text-xs text-gray-500 italic">
                  Additional clue available for emergency decryption.
                </span>
                <button
                  onClick={handleGetExtraHint}
                  disabled={score < 10}
                  className={`text-xs font-mono px-4 py-2 rounded-lg border transition-all uppercase tracking-wider font-bold shrink-0 ${
                    score < 10
                      ? 'border-rose-500/30 text-rose-400 bg-rose-950/20 cursor-not-allowed'
                      : 'border-indigo-400/50 text-indigo-300 hover:bg-indigo-950/60 hover:text-white cursor-pointer'
                  }`}
                >
                  {score < 10 ? 'NOT ENOUGH XP' : 'Unlock Extra Hint (-10 XP)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
