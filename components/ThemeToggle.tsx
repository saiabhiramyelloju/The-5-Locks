"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-sm">
      <button
        onClick={() => theme === 'light' && toggleTheme()}
        className={`p-2 rounded-full transition-all text-xs font-mono uppercase ${
          theme === 'dark'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        🌙 Dark
      </button>
      <button
        onClick={() => theme === 'dark' && toggleTheme()}
        className={`p-2 rounded-full transition-all text-xs font-mono uppercase ${
          theme === 'light'
            ? 'bg-white text-slate-900 shadow-lg'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        ☀️ Light
      </button>
    </div>
  );
};
