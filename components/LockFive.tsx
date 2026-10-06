"use client";

import React, { useState, useEffect } from 'react';
import { SecurityCore, type SecurityStatus } from './SecurityCore';

interface Stage {
  narrative: string;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  successMessage: string;
  explanation: string;
  stageStatus: SecurityStatus;
}

const RECOVERY_STAGES: Stage[] = [
  {
    narrative: "Security logs show that an administrator account was previously compromised.",
    question: "What should be done first to secure the account?",
    options: [
      { text: "Keep the existing password because the attack has stopped.", correct: false, explanation: "Keeping the password allows the attacker to return using the stolen credentials." },
      { text: "Force a password reset and secure the account.", correct: true, explanation: "The compromised credentials must be replaced so previously exposed credentials can no longer be used." },
      { text: "Share the password with the administrator.", correct: false, explanation: "Sharing passwords increases the risk of further compromise." },
    ],
    successMessage: "✓ ACCOUNT SECURED",
    explanation: "The compromised credentials must be replaced so previously exposed credentials can no longer be used.",
    stageStatus: 'analyzing',
  },
  {
    narrative: "The workstation involved in the incident was isolated from the network.",
    question: "What should happen next?",
    options: [
      { text: "Immediately reconnect the workstation.", correct: false, explanation: "Reconnect the affected system before verification could allow a remaining threat to spread." },
      { text: "Keep it isolated until the system has been verified.", correct: true, explanation: "An affected system should remain isolated until it has been checked and confirmed safe." },
      { text: "Give the workstation access to every network service.", correct: false, explanation: "Giving full access to an unverified device is a critical security risk." },
    ],
    successMessage: "✓ DEVICE REMAINS ISOLATED",
    explanation: "An affected system should remain isolated until it has been checked and confirmed safe.",
    stageStatus: 'processing',
  },
  {
    narrative: "The investigation found a suspicious executable on the isolated workstation.",
    question: "What is the appropriate action?",
    options: [
      { text: "Open the file to see what it does.", correct: false, explanation: "Opening a suspicious file can trigger the malware and compromise the analyst's system." },
      { text: "Restore the file to the system.", correct: false, explanation: "Restoring a malicious file allows the threat to persist." },
      { text: "Keep the file quarantined and verify its removal.", correct: true, explanation: "The suspicious file should remain isolated while the system is verified." },
    ],
    successMessage: "✓ MALICIOUS FILE CONTAINED",
    explanation: "The suspicious file should remain isolated while the system is verified.",
    stageStatus: 'securing',
  },
  {
    narrative: "The firewall previously blocked an unauthorized external connection.",
    question: "Before reconnecting the affected system, what should you verify?",
    options: [
      { text: "That unauthorized external connections are no longer active.", correct: true, explanation: "The system should be checked for remaining unauthorized communication before normal access is restored." },
      { text: "That the firewall is disabled.", correct: false, explanation: "Disabling the firewall exposes the system to all threats." },
      { text: "That every external connection is allowed.", correct: false, explanation: "Allowing all connections defeats the purpose of the firewall." },
    ],
    successMessage: "✓ NETWORK VERIFIED",
    explanation: "The system should be checked for remaining unauthorized communication before normal access is restored.",
    stageStatus: 'verifying',
  },
  {
    narrative: "The known threats have been contained. The account has been secured. The device has been isolated. The suspicious file has been contained. The unauthorized connection has been blocked.",
    question: "What is the final step before declaring the incident resolved?",
    options: [
      { text: "Ignore the previous alerts because the attack has stopped.", correct: false, explanation: "Ignoring alerts is negligence and may miss dormant threats." },
      { text: "Review the logs and verify that the system is clean and stable.", correct: true, explanation: "A final audit of logs ensures no other anomalies were missed." },
      { text: "Shut down the entire company's network permanently.", correct: false, explanation: "Permanent shutdown is an excessive response that halts business operations." },
    ],
    successMessage: "✓ FINAL SYSTEM CHECK COMPLETE",
    explanation: "A final audit of logs ensures no other anomalies were missed.",
    stageStatus: 'secured',
  },
];

interface LockFiveProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onStatusChange?: (status: SecurityStatus) => void;
}

export const LockFive: React.FC<LockFiveProps> = ({
  score,
  setScore,
  onSuccess,
  currentLock,
  setTimerActive,
  onStatusChange,
}) => {
  const [view, setView] = useState<'intro' | 'story'>('intro');
  const [currentStage, setCurrentStage] = useState(0);
  const [stageState, setStageState] = useState<'question' | 'correct'>('question');
  const [error, setError] = useState('');
  const [localStatus, setLocalStatus] = useState<SecurityStatus>('idle');

  const handleBeginCheck = () => {
    setView('story');
    setTimerActive(true);
    const initialStageStatus = RECOVERY_STAGES[0].stageStatus;
    setLocalStatus(initialStageStatus);
    onStatusChange?.(initialStageStatus);
  };

  const handleOptionSelect = (option: { correct: boolean; explanation: string }) => {
    if (option.correct) {
      setStageState('correct');
      setError('');

      const isFinalStage = currentStage === RECOVERY_STAGES.length - 1;
      const nextStatus = isFinalStage ? 'secured' : 'success';
      setLocalStatus(nextStatus);
      onStatusChange?.(nextStatus);

      setTimeout(() => {
        if (!isFinalStage) {
          const nextIdx = currentStage + 1;
          setCurrentStage(nextIdx);
          setStageState('question');
          const nextStageStatus = RECOVERY_STAGES[nextIdx].stageStatus;
          setLocalStatus(nextStageStatus);
          onStatusChange?.(nextStageStatus);
        } else {
          onSuccess();
        }
      }, 2600);
    } else {
      setScore((prev) => Math.max(0, prev - 10));
      setError(`INCORRECT ACTION: ${option.explanation}`);
      setLocalStatus('error');
      onStatusChange?.('error');

      setTimeout(() => {
        setLocalStatus(RECOVERY_STAGES[currentStage].stageStatus);
        onStatusChange?.(RECOVERY_STAGES[currentStage].stageStatus);
      }, 3000);
    }
  };

  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center space-y-6 w-full relative overflow-hidden border border-emerald-500/30 shadow-2xl">
          <div className="flex justify-center mb-2">
            <SecurityCore status="securing" size="lg" withRings={true} />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] uppercase tracking-widest font-bold">
              Lock 5 / The Climax
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              Final System Recovery
            </h2>
          </div>

          <p className="text-emerald-400 font-mono tracking-widest uppercase text-xs font-semibold">
            "The attack has been contained. Now prove the system is secure."
          </p>

          <div className="space-y-2 text-gray-300 font-mono text-xs sm:text-sm leading-relaxed max-w-md mx-auto p-4 rounded-xl bg-black/40 border border-white/5 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>✓</span> Phishing wave filtered
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>✓</span> Encrypted vault keys reassembled
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>✓</span> Host trojan quarantined
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>✓</span> Rogue SSH ingress intercepted
            </div>
            <div className="pt-2 border-t border-white/10 text-white font-bold italic">
              "Execute the 5-phase incident recovery checklist to restore operational baseline."
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleBeginCheck}
              className="py-4 px-10 cyber-btn-primary rounded-full text-sm font-black tracking-widest shadow-xl cursor-pointer"
            >
              Begin Final Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stage = RECOVERY_STAGES[currentStage];

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl w-full space-y-6 border border-emerald-500/30 shadow-2xl relative">
        {/* Header: Stage Tracker & Orb */}
        <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <SecurityCore status={localStatus} size="sm" />
            <div>
              <h2 className="text-sm font-mono text-emerald-400 uppercase font-bold tracking-wider">
                INCIDENT RESPONSE: STAGE {currentStage + 1}/5
              </h2>
              <span className="text-[10px] font-mono text-gray-400">RESTORATION PROTOCOL</span>
            </div>
          </div>

          {/* Stage Pips */}
          <div className="flex items-center gap-1.5">
            {RECOVERY_STAGES.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx < currentStage
                    ? 'w-4 bg-emerald-400'
                    : idx === currentStage
                    ? 'w-6 bg-cyan-400 animate-pulse'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {stageState === 'question' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-gray-300 font-mono text-sm leading-relaxed italic">
                "{stage.narrative}"
              </div>
              <p className="text-white font-bold font-sans text-lg sm:text-xl uppercase tracking-tight">
                {stage.question}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {stage.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  className="p-4 rounded-xl border border-white/10 text-left text-gray-300 font-mono text-xs sm:text-sm hover:bg-white/10 hover:border-emerald-400 hover:text-white transition-all cursor-pointer flex items-start gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <span className="w-6 h-6 rounded-md bg-black/40 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-emerald-400 group-hover:text-black font-bold shrink-0 transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed mt-0.5">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-5 py-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center text-3xl text-emerald-400 animate-in zoom-in duration-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                ✓
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-widest font-mono">
              {stage.successMessage}
            </h3>
            <p className="text-gray-300 font-mono text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              {stage.explanation}
            </p>
            <p className="text-xs text-cyan-400 font-mono animate-pulse uppercase tracking-wider">
              {currentStage < RECOVERY_STAGES.length - 1
                ? 'Synthesizing subsequent recovery node...'
                : 'Incident response protocol concluded successfully...'}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 font-mono text-xs uppercase animate-shake text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
