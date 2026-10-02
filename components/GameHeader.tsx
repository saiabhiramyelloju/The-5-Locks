import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const GameHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative text-center mb-8">
      <button
        onClick={toggleTheme}
        className="absolute -top-2 -right-12 md:right-0 p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white font-mono text-xs uppercase tracking-widest"
        title="Toggle Theme"
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 uppercase italic">
        The 5 Locks
      </h1>
      <p className="text-cyan-400 font-mono tracking-widest uppercase text-sm">
        Cybersecurity Challenge
      </p>
    </div>
  );
};
