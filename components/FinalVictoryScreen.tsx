"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ThreeVictoryScene } from './ThreeVictoryScene';
import { SecurityCore, type SecurityStatus } from './SecurityCore';
import { ConfettiEffect } from './ConfettiEffect';
import { safeAnimate } from '../lib/anime';

interface VictoryProps {
  score: number;
  onRestart: () => void;
}

export const FinalVictoryScreen: React.FC<VictoryProps> = ({ score, onRestart }) => {
  const [stage, setStage] = useState(0);
  const [isFullyActive, setIsFullyActive] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [orbStatus, setOrbStatus] = useState<SecurityStatus>('processing');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sequential activation: Node 1 -> Node 2 -> Node 3 -> Node 4 -> Node 5 -> CORE FULLY ACTIVE
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setStage(1), 400));
    timers.push(setTimeout(() => setStage(2), 800));
    timers.push(setTimeout(() => setStage(3), 1200));
    timers.push(setTimeout(() => {
      setStage(4);
      setOrbStatus('verifying');
    }, 1600));
    timers.push(setTimeout(() => setStage(5), 2000));
    timers.push(
      setTimeout(() => {
        setIsFullyActive(true);
        setOrbStatus('secured');
        setShowContent(true);
      }, 2500)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (showContent && cardRef.current) {
      safeAnimate(cardRef.current, {
        opacity: [0, 1],
        scale: [0.94, 1],
        translateY: [20, 0],
        duration: 500,
        ease: 'outExpo',
      });
    }
  }, [showContent]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050811] overflow-hidden select-none">
      {/* 1. Dedicated Three.js Victory Atmosphere */}
      <ThreeVictoryScene activeStage={stage} isFullyActive={isFullyActive} />

      {/* 2. Confetti Particle Burst once complete */}
      {showContent && <ConfettiEffect />}

      {/* 3. Centered Victory Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full px-4">
        {!showContent ? (
          /* Sequence Initial Loading / Sequential Activation */
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 text-center space-y-6 animate-in fade-in duration-500 shadow-2xl">
            <div className="flex justify-center">
              <SecurityCore status={orbStatus} size="xl" withRings={true} speed={1.3} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter animate-pulse">
                STABILIZING CYBER DEFENSE CORE...
              </h2>
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                VERIFYING LOCK NODES [{stage}/5]
              </p>
            </div>

            <div className="flex justify-center gap-2 font-mono text-xs">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`px-3 py-1.5 rounded-lg border transition-all duration-400 ${
                    stage >= num
                      ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300 font-bold scale-105 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'border-white/10 bg-black/40 text-gray-600'
                  }`}
                >
                  {stage >= num ? '🔓 L' + num : '🔒 L' + num}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Final Certified Victory Card */
          <div
            ref={cardRef}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 text-center space-y-5 shadow-[0_0_60px_rgba(0,0,0,0.8)] w-full"
          >
            {/* Thinking Orb in final SECURED state */}
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-emerald-950/40 border border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <SecurityCore
                  status="secured"
                  size="lg"
                  withRings={true}
                  showLabel={false}
                />
              </div>
            </div>

            {/* Typography constraints respected via clamp() */}
            <div className="space-y-1">
              <h1
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                className="font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]"
              >
                Mission Complete
              </h1>
              <h2
                style={{ fontSize: 'clamp(20px, 3.5vw, 28px)' }}
                className="font-bold text-cyan-400 uppercase tracking-widest font-mono"
              >
                The 5 Locks
              </h2>
            </div>

            <div className="space-y-1">
              <p
                style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}
                className="text-emerald-400 font-mono font-bold uppercase tracking-widest"
              >
                All Five Locks Breached
              </p>
              <p className="text-white/80 font-mono text-xs uppercase tracking-wider">
                Cyber System Secured
              </p>
            </div>

            {/* Checklist of locks */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-1 font-mono text-xs">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>✓</span>
                  <span>LOCK {i}</span>
                </div>
              ))}
            </div>

            {/* Final Score Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1 inline-block min-w-[200px] mx-auto">
              <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                Final Security Score
              </p>
              <div
                style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
                className="font-black text-white font-mono flex items-center justify-center gap-1.5"
              >
                <span>{score}</span>
                <span className="text-sm text-cyan-400 font-normal">XP</span>
              </div>
              <p className="text-emerald-400 font-mono text-[11px] uppercase">
                System Restored to Operational Baseline
              </p>
            </div>

            {/* Play Again Action */}
            <div className="pt-2">
              <button
                onClick={onRestart}
                className="py-3 px-10 cyber-btn-primary rounded-full text-xs sm:text-sm font-black tracking-widest shadow-xl cursor-pointer"
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
