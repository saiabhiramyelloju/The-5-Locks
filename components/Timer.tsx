import React from 'react';

interface TimerProps {
  timeRemaining: number;
}

export const Timer = ({ timeRemaining }: TimerProps) => {
  const seconds = timeRemaining % 60;
  const minutes = Math.floor(timeRemaining / 60);

  return (
    <div className="font-mono text-xl text-red-400">
      TIME <span className="text-white">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
