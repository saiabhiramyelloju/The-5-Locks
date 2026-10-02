import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay = ({ score }: ScoreDisplayProps) => (
  <div className="font-mono text-xl text-cyan-400">
    XP <span className="text-white">{score}</span>
  </div>
);
