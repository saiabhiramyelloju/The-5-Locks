"use client";

import React, { useEffect, useRef } from 'react';
import { SecurityCore } from './SecurityCore';
import { safeAnimate } from '../lib/anime';

interface StartScreenProps {
  onStart: () => void;
  onReset?: () => void;
  hasSavedGame?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onReset,
  hasSavedGame = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fast Anime.js choreographed entrance (total ~500ms, not sluggish)
    const anim = safeAnimate(
      [
        orbRef.current,
        titleRef.current,
        subtitleRef.current,
        quoteRef.current,
        buttonRef.current,
      ],
      {
        opacity: [0, 1],
        translateY: [16, 0],
        scale: [0.96, 1],
        delay: (el: any, i: number) => i * 80,
        duration: 450,
        ease: 'outExpo',
      }
    );

    return () => {
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 max-w-xl mx-auto space-y-7"
    >
      {/* 1. Security Orb Centerpiece */}
      <div ref={orbRef} className="relative flex items-center justify-center">
        <SecurityCore
          status="idle"
          size="hero"
          withRings={true}
          speed={1.1}
          showLabel={false}
        />
      </div>

      {/* 2. Title & Subtitle */}
      <div className="space-y-2">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_0_35px_rgba(0,240,255,0.25)]"
        >
          The 5 Locks
        </h1>
        <p
          ref={subtitleRef}
          className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs sm:text-sm font-semibold"
        >
          Cybersecurity Challenge
        </p>
      </div>

      {/* 3. Quote */}
      <p
        ref={quoteRef}
        className="text-gray-300 font-mono text-sm sm:text-base italic max-w-md border-y border-white/10 py-3 text-balance opacity-90"
      >
        "Five locks. One compromised system."
      </p>

      {/* 4. Action Buttons */}
      <div ref={buttonRef} className="flex flex-col items-center gap-3 pt-2 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full py-4 px-8 cyber-btn-primary rounded-full text-base font-black tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span>START LOCK 1</span>
          <span className="text-cyan-600 font-normal">→</span>
        </button>

        {hasSavedGame && onReset && (
          <button
            onClick={onReset}
            className="text-xs font-mono text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-widest underline underline-offset-4 cursor-pointer mt-1"
          >
            Reset Saved Progress
          </button>
        )}
      </div>

      {/* Subtle terminal footer info */}
      <div className="flex items-center gap-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest pt-4">
        <span>● LIVE SOC SIMULATION</span>
        <span>|</span>
        <span>500 XP MAXIMUM</span>
      </div>
    </div>
  );
};
