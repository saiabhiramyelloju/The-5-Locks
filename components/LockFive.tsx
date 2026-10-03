"use client";

import React, { useState, useEffect } from 'react';

interface Stage {
  narrative: string;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  successMessage: string;
  explanation: string;
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
    explanation: "The compromised credentials must be replaced so previously exposed credentials can no longer be used."
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
    explanation: "An affected system should remain isolated until it has been checked and confirmed safe."
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
    explanation: "The suspicious file should remain isolated while the system is verified."
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
    explanation: "The system should be checked for remaining unauthorized communication before normal access is restored."
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
    explanation: "A final audit of logs ensures no other anomalies were missed."
  }
];

interface LockFiveProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LockFive = ({ score, setScore, onSuccess, currentLock, setTimerActive }: LockFiveProps) => {
  const [view, setView] = useState<'intro' | 'story'>('intro');
  const [currentStage, setCurrentStage] = useState(0);
  const [stageState, setStageState] = useState<'question' | 'correct'>('question');
  const [error, setError] = useState('');

  const handleBeginCheck = () => {
    setView('story');
    setTimerActive(true);
  };

  const handleOptionSelect = (option: { correct: boolean; explanation: string }) => {
    if (option.correct) {
      setStageState('correct');
      setError('');

      setTimeout(() => {
        if (currentStage < RECOVERY_STAGES.length - 1) {
          setCurrentStage(prev => prev + 1);
          setStageState('question');
        } else {
          onSuccess();
        }
      }, 3000);
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setError(`INCORRECT ACTION: ${option.explanation}`);
    }
  };

  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Lock 5 — Final System Recovery
          </h2>
          <p className="text-cyan-400 font-mono tracking-widest uppercase text-sm">
            "The attack has been contained. Now prove the system is secure."
          </p>
          <div className="space-y-3 text-gray-300 font-mono text-sm leading-relaxed">
            <p>"Most of the attack has been contained."</p>
            <p>"The phishing attempt was identified."</p>
            <p>"The compromised credentials were secured."</p>
            <p>"The malicious file was quarantined."</p>
            <p>"The suspicious network connection was blocked."</p>
            <p className="text-white font-bold italic">"But the incident isn't over yet."</p>
            <p>"One final security check remains."</p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleBeginCheck}
              className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-lg"
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
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
      <div className="glass-panel p-8 rounded-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-xl font-mono text-cyan-400 uppercase">System Recovery: Stage {currentStage + 1}/5</h2>
          <div className="flex gap-1">
            {RECOVERY_STAGES.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${idx <= currentStage ? 'bg-cyan-400' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {stageState === 'question' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-300 font-mono text-lg leading-relaxed italic">
                "{stage.narrative}"
              </p>
              <p className="text-white font-bold font-mono text-xl uppercase tracking-tight">
                {stage.question}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {stage.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  className="p-4 rounded-lg border border-white/10 text-left text-gray-300 font-mono text-sm hover:bg-white/10 hover:border-cyan-400 transition-all text-balance"
                >
                  <span className="text-cyan-400 mr-3">{String.fromCharCode(65 + idx)}.</span> {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="text-5xl animate-bounce">✓</div>
            <h3 className="text-2xl font-black text-green-400 uppercase tracking-widest font-mono">
              {stage.successMessage}
            </h3>
            <p className="text-gray-300 font-mono text-sm leading-relaxed px-4">
            {stage.explanation}
            </p>
            <p className="text-xs text-cyan-500 font-mono animate-pulse uppercase tracking-tighter">
              Analyzing next system state...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 text-red-400 font-mono text-xs uppercase animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
