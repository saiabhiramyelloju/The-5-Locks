import React from 'react';

interface LockProgressProps {
  currentLock: number;
}

export const LockProgress = ({ currentLock }: LockProgressProps) => {
  const locks = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 font-mono text-lg mb-8">
      {locks.map((lock, index) => (
        <React.Fragment key={lock}>
          <span className={`transition-all duration-500 ${lock <= currentLock ? 'text-green-400' : 'text-gray-600'}`}>
            {lock <= currentLock ? '🔓' : '🔒'} {lock}
          </span>
          {index < locks.length - 1 && (
            <span className={`hidden md:inline ${lock < currentLock ? 'text-green-400' : 'text-gray-700'}`}>
              ───
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
