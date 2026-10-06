"use client";

import React, { useEffect, useRef, useState } from 'react';
import { animateCounter } from '../lib/anime';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [displayed, setDisplayed] = useState(score);
  const prevRef = useRef(score);

  useEffect(() => {
    if (prevRef.current !== score) {
      animateCounter(prevRef.current, score, (val) => setDisplayed(val), 600);
      prevRef.current = score;
    }
  }, [score]);

  return (
    <div className="font-mono text-sm sm:text-base text-cyan-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20">
      <span className="text-[10px] text-gray-500 uppercase">XP</span>
      <span className="text-white text-base sm:text-lg">{displayed}</span>
    </div>
  );
};
