"use client";

import React, { useState, useEffect } from 'react';
import * as anime from 'animejs';
import { GameHeader } from '../components/GameHeader';
import { LockProgress } from '../components/LockProgress';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Timer } from '../components/Timer';
import { SuccessScreen } from '../components/SuccessScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import { StartScreen } from '../components/StartScreen';
import { LockOne } from '../components/LockOne';
import { LockTwo } from '../components/LockTwo';
import { LockThree } from '../components/LockThree';
import { LockFour } from '../components/LockFour';
import { LockFive } from '../components/LockFive';
import { FinalVictoryScreen } from '../components/FinalVictoryScreen';
import { InsufficientXPScreen } from '../components/InsufficientXPScreen';
import { EmailViewer } from '../components/EmailViewer';

interface Email {
  id: string;
  sender: string;
  subject: string;
  message: string;
  isPhishing: boolean;
}

const EMAILS: Email[] = [
  {
    id: '1',
    sender: 'notifications@linkedin.com',
    subject: 'New Job Opportunity: Junior Security Analyst',
    message: 'Hello,\n\nBased on your profile and skills in Cybersecurity, a recruiter from TechGuard Solutions has viewed your profile and suggested you for a Junior Security Analyst position.\n\nLog in to your LinkedIn account to view the full job description and apply.\n\nBest regards,\nLinkedIn Recruiter Team',
    isPhishing: false,
  },
  {
    id: 'phish',
    sender: 'support@it-security-update.com',
    subject: 'Action Required: Your Account is Restricted',
    message: 'Dear User,\n\nOur security system has detected an unauthorized attempt to access your account from a device in another country. For your protection, we have temporarily restricted access to your portal.\n\nTo restore full access and verify your identity, you must sign in to our security validation portal immediately:\n\nValidate Here: http://account-verify-secure.net/security-check\n\nFailure to verify your account within 12 hours will result in a permanent lock of your records.\n\nIT Security Department',
    isPhishing: true,
  },
  {
    id: '2',
    sender: 'no-reply@github.com',
    subject: '[GitHub] Security Alert: Dependency Vulnerability',
    message: 'Hello,\n\nWe found a security vulnerability in one of the dependencies of your repository "Cyber-Lock-Project". \n\nOur Dependabot has automatically opened a pull request to update the package to a secure version. Please review and merge the PR to secure your code.\n\nView the alert on GitHub.',
    isPhishing: false,
  },
  {
    id: '3',
    sender: 'newsletter@medium.com',
    subject: 'Top Stories in Cybersecurity this Week',
    message: 'Hi there,\n\nHere are the top reads curated for you:\n1. The Rise of AI-driven Phishing\n2. Zero Trust Architecture Explained\n3. How to Secure Your Home Network\n\nRead the full articles on Medium to stay updated with the latest industry trends.\n\nHappy reading!',
    isPhishing: false,
  },
];

type GameState = 'start' | 'playing' | 'success' | 'timeout' | 'complete' | 'insufficient-xp';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentLock, setCurrentLock] = useState(1);
  const [completedLock, setCompletedLock] = useState<number | null>(null);
  const [score, setScore] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const animeFunc = (anime as any).default || anime;
      if (typeof animeFunc === 'function') {
        animeFunc({
          targets: '.cyber-grid',
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeOutExpo'
        });

        if (gameState === 'start') {
          animeFunc({
            targets: '.start-screen-container',
            scale: [0.95, 1],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .8)',
            delay: 200
          });
        }
      }
    } catch (e) {
      console.error('Animation error:', e);
    }
  }, [gameState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'playing' && timerActive) {
      setGameState('timeout');
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining, timerActive]);

  const handleStart = () => {
    setGameState('playing');
    setCurrentLock(1);
    setScore(0);
    setTimeRemaining(60);
    setTimerActive(false);
  };

  const handleMarkPhishing = () => {
    setCompletedLock(currentLock);
    setScore(prev => prev + 100);
    setGameState('success');
  };

  const handleContinue = () => {
    if (currentLock < 5) {
      setCurrentLock(prev => prev + 1);
      setGameState('playing');
      // Reset timer for new level
      const nextLockDuration = (currentLock + 1 >= 4) ? 120 : 60;
      setTimeRemaining(nextLockDuration);
      setTimerActive(false);
    } else {
      if (score >= 450) {
        setGameState('complete');
      } else {
        setGameState('insufficient-xp');
      }
    }
  };

  const handleRestart = () => {
    setGameState('start');
  };

  const handleResetGame = () => {
    if (confirm('Are you sure? Your saved progress will be deleted.')) {
      localStorage.removeItem('the5locks-game-state');
      setGameState('start');
      setCurrentLock(1);
      setScore(0);
      setTimeRemaining(60);
      setTimerActive(false);
    }
  };

  if (gameState === 'timeout') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <GameOverScreen onRestart={handleRestart} />
      </main>
    );
  }

  if (gameState === 'insufficient-xp') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <InsufficientXPScreen onRestart={handleRestart} />
      </main>
    );
  }

  if (gameState === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <SuccessScreen
          completedLock={completedLock || 1}
          onRestart={handleContinue}
        />
      </main>
    );
  }

  if (gameState === 'complete') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 cyber-grid relative">
        <div className="absolute inset-0 theme-overlay pointer-events-none"></div>
        <FinalVictoryScreen score={score} onRestart={handleRestart} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 cyber-grid relative">
      <div className="absolute inset-0 theme-overlay pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {gameState === 'start' ? (
          <div className="start-screen-container w-full flex justify-center">
            <StartScreen onStart={handleStart} onReset={handleResetGame} />
          </div>
        ) : (
          <>
            <GameHeader />
            <LockProgress currentLock={currentLock} />

            <div className="flex justify-between w-full max-w-2xl mb-8 font-mono">
              <ScoreDisplay score={score} />
              <Timer timeRemaining={timeRemaining} />
            </div>

            {currentLock === 1 && (
              <LockOne
                emails={EMAILS}
                score={score}
                setScore={setScore}
                onSuccess={() => {
                  setCompletedLock(1);
                  setScore(prev => prev + 100);
                  setGameState('success');
                  setTimerActive(false);
                }}
                setTimerActive={setTimerActive}
              />
            )}
            {currentLock === 2 && (
              <LockTwo
                score={score}
                setScore={setScore}
                onSuccess={() => {
                  setCompletedLock(2);
                  setScore(prev => prev + 100);
                  setGameState('success');
                  setTimerActive(false);
                }}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
              />
            )}
            {currentLock === 3 && (
              <LockThree
                score={score}
                setScore={setScore}
                onSuccess={() => {
                  setCompletedLock(3);
                  setScore(prev => prev + 100);
                  setGameState('success');
                  setTimerActive(false);
                }}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
              />
            )}
            {currentLock === 4 && (
              <LockFour
                score={score}
                setScore={setScore}
                onSuccess={() => {
                  setCompletedLock(4);
                  setScore(prev => prev + 100);
                  setGameState('success');
                  setTimerActive(false);
                }}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
              />
            )}
            {currentLock === 5 && (
              <LockFive
                score={score}
                setScore={setScore}
                onSuccess={() => {
                  setCompletedLock(5);
                  setScore(prev => prev + 100);
                  setGameState('success');
                  setTimerActive(false);
                }}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
              />
            )}
          </>
        )}
      </div>

      {selectedEmailId && (
        <EmailViewer
          email={EMAILS.find(e => e.id === selectedEmailId)}
          onClose={() => setSelectedEmailId(null)}
          onMarkPhishing={handleMarkPhishing}
        />
      )}
    </main>
  );
}
