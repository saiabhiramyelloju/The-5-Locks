"use client";

import React, { useEffect, useRef } from 'react';
import { SecurityCore } from './SecurityCore';
import { safeAnimate } from '../lib/anime';

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
    reward: 100,
  },
  2: {
    title: "LOCK BREACHED",
    subtitle: "VAULT ACCESS GRANTED",
    analysis: "You successfully reconstructed the administrative password by analyzing the provided encrypted clues and combining the digital components.",
    reward: 100,
  },
  3: {
    title: "LOCK BREACHED",
    subtitle: "THREAT CONTAINED",
    analysis: "By analyzing file metadata and signatures, you correctly identified a malicious executable from an unverified external source and quarantined it.",
    reward: 100,
  },
  4: {
    title: "LOCK BREACHED",
    subtitle: "FIREWALL SECURED",
    analysis: "The connection originated outside the internal network, came from an unknown device, and attempted to reach the administrative server through SSH on port 22.",
    reward: 100,
  },
  5: {
    title: "LOCK 5 BREACHED",
    subtitle: "FINAL SYSTEM SECURED",
    analysis: "All known threats have been contained and the system has passed the final security check.",
    reward: 100,
  },
};

interface SuccessScreenProps {
  completedLock: number;
  onRestart: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ completedLock, onRestart }) => {
  const data = LOCK_COMPLETION_DATA[completedLock] || LOCK_COMPLETION_DATA[1];

  const orbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const rewardRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Choreographed Anime.js entrance sequence
    const anim = safeAnimate(
      [
        orbRef.current,
        titleRef.current,
        rewardRef.current,
        analysisRef.current,
        buttonRef.current,
      ],
      {
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.95, 1],
        delay: (el: any, i: number) => i * 90,
        duration: 450,
        ease: 'outExpo',
      }
    );

    return () => {
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    };
  }, [completedLock]);

  return (
    <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto px-4 py-8">
      {/* 1. Security Orb in Success Mode */}
      <div ref={orbRef} className="flex justify-center">
        <div className="relative p-3 rounded-full bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
          <SecurityCore
            status="success"
            size="xl"
            withRings={true}
            speed={1.2}
          />
        </div>
      </div>

      {/* 2. Title & Subtitle */}
      <div ref={titleRef} className="space-y-1">
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          {data.title}
        </h2>
        <p className="text-emerald-400 font-mono tracking-widest uppercase text-xs sm:text-sm font-bold">
          {data.subtitle}
        </p>
      </div>

      {/* 3. Reward Display */}
      <div ref={rewardRef} className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/60 border border-emerald-400/50 text-emerald-300 font-mono text-xl sm:text-2xl font-black shadow-lg">
          <span>+{data.reward}</span>
          <span className="text-xs text-emerald-400 font-normal">XP AWARDED</span>
        </div>
      </div>

      {/* 4. Security Analysis Panel */}
      <div
        ref={analysisRef}
        className="glass-panel p-5 sm:p-6 rounded-2xl max-w-md mx-auto text-left space-y-2 border border-emerald-500/30"
      >
        <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <span>SECURITY INCIDENT AUDIT</span>
          <span className="text-emerald-400">STATUS: RESOLVED</span>
        </div>
        <p className="text-gray-300 font-mono text-xs sm:text-sm leading-relaxed pt-1">
          {data.analysis}
        </p>
      </div>

      {/* 5. Continue Button */}
      <div ref={buttonRef} className="pt-2">
        <button
          onClick={onRestart}
          className="py-3.5 px-10 cyber-btn-primary rounded-full text-xs sm:text-sm font-black tracking-widest shadow-xl cursor-pointer"
        >
          {completedLock < 5 ? 'Continue to Next Lock' : 'Proceed to Final Certification'}
        </button>
      </div>
    </div>
  );
};
