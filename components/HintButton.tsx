import React from 'react';

interface HintButtonProps {
  onUseHint: () => void;
  hintUsed: boolean;
  hintText: string;
}

export const HintButton = ({ onUseHint, hintUsed, hintText }: HintButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        disabled={hintUsed}
        onClick={onUseHint}
        className={`
          px-4 py-2 rounded-full font-mono text-xs transition-all
          ${hintUsed
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
            : 'bg-cyan-900/30 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20'}
        `}
      >
        {hintUsed ? 'HINT USED' : 'GET HINT'}
      </button>
      {hintUsed && (
        <div className="max-w-md text-center animate-in slide-in-from-bottom-2 duration-500">
          <p className="text-sm text-gray-400 font-mono italic">
            💡 {hintText}
          </p>
        </div>
      )}
    </div>
  );
};
