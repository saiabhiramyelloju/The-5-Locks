"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '../components/GameHeader';
import { LockProgress } from '../components/LockProgress';
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
import { ThreeBackground } from '../components/ThreeBackground';
import { type SecurityStatus } from '../components/SecurityCore';
import { safeAnimate } from '../lib/anime';

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
    message:
      'Hello,\n\nBased on your profile and skills in Cybersecurity, a recruiter from TechGuard Solutions has viewed your profile and suggested you for a Junior Security Analyst position.\n\nLog in to your LinkedIn account to view the full job description and apply.\n\nBest regards,\nLinkedIn Recruiter Team',
    isPhishing: false,
  },
  {
    id: 'phish',
    sender: 'support@it-security-update.com',
    subject: 'Action Required: Your Account is Restricted',
    message:
      'Dear User,\n\nOur security system has detected an unauthorized attempt to access your account from a device in another country. For your protection, we have temporarily restricted access to your portal.\n\nTo restore full access and verify your identity, you must sign in to our security validation portal immediately:\n\nValidate Here: http://account-verify-secure.net/security-check\n\nFailure to verify your account within 12 hours will result in a permanent lock of your records.\n\nIT Security Department',
    isPhishing: true,
  },
  {
    id: '2',
    sender: 'no-reply@github.com',
    subject: '[GitHub] Security Alert: Dependency Vulnerability',
    message:
      'Hello,\n\nWe found a security vulnerability in one of the dependencies of your repository "Cyber-Lock-Project". \n\nOur Dependabot has automatically opened a pull request to update the package to a secure version. Please review and merge the PR to secure your code.\n\nView the alert on GitHub.',
    isPhishing: false,
  },
  {
    id: '3',
    sender: 'newsletter@medium.com',
    subject: 'Top Stories in Cybersecurity this Week',
    message:
      'Hi there,\n\nHere are the top reads curated for you:\n1. The Rise of AI-driven Phishing\n2. Zero Trust Architecture Explained\n3. How to Secure Your Home Network\n\nRead the full articles on Medium to stay updated with the latest industry trends.\n\nHappy reading!',
    isPhishing: false,
  },
];

type GameState = 'start' | 'playing' | 'success' | 'timeout' | 'complete' | 'insufficient-xp';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentLock, setCurrentLock] = useState<number>(1);
  const [completedLock, setCompletedLock] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>('idle');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  const levelContainerRef = useRef<HTMLDivElement>(null);

  // 1. Load saved state on mount
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem('the5locks-game-state');
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        setHasSavedGame(true);
        if (typeof saved.score === 'number') setScore(saved.score);
        if (typeof saved.currentLock === 'number') setCurrentLock(saved.currentLock);
        if (saved.completedLock !== undefined) setCompletedLock(saved.completedLock);
        if (typeof saved.timeRemaining === 'number') setTimeRemaining(saved.timeRemaining);
        if (saved.gameState) setGameState(saved.gameState);
      }
    } catch (e) {
      console.warn('Failed to hydrate state:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Synchronize game state to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const savedRaw = localStorage.getItem('the5locks-game-state');
      const prev = savedRaw ? JSON.parse(savedRaw) : {};
      localStorage.setItem(
        'the5locks-game-state',
        JSON.stringify({
          ...prev,
          score,
          currentLock,
          gameState,
          completedLock,
          timeRemaining,
        })
      );
    } catch (e) {
      console.warn('Failed to persist state:', e);
    }
  }, [score, currentLock, gameState, completedLock, timeRemaining, isHydrated]);

  // 3. Smooth Anime.js transition on state / lock change
  useEffect(() => {
    if (levelContainerRef.current) {
      safeAnimate(levelContainerRef.current, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 400,
        ease: 'outExpo',
      });
    }
  }, [gameState, currentLock]);

  // 4. Timer effect: Controlled strictly by React
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'playing' && timerActive) {
      setTimerActive(false);
      setSecurityStatus('error');
      setGameState('timeout');
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining, timerActive]);

  // Handlers
  const handleStart = () => {
    setGameState('playing');
    setCurrentLock(1);
    setCompletedLock(null);
    setScore(0);
    setTimeRemaining(60);
    setTimerActive(false);
    setSecurityStatus('idle');
  };

  const handleLockSuccess = (lockNum: number) => {
    setCompletedLock(lockNum);
    setScore((prev) => prev + 100);
    setTimerActive(false);
    setSecurityStatus('success');
    setGameState('success');
  };

  const handleContinue = () => {
    if (currentLock < 5) {
      const nextLock = currentLock + 1;
      setCurrentLock(nextLock);
      setGameState('playing');
      const nextDuration = nextLock >= 4 ? 120 : 60;
      setTimeRemaining(nextDuration);
      setTimerActive(false);
      setSecurityStatus('idle');
    } else {
      setTimerActive(false);
      if (score >= 450) {
        setGameState('complete');
      } else {
        setGameState('insufficient-xp');
      }
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem('the5locks-game-state');
    } catch {}
    setGameState('start');
    setCurrentLock(1);
    setCompletedLock(null);
    setScore(0);
    setTimeRemaining(60);
    setTimerActive(false);
    setSecurityStatus('idle');
    setHasSavedGame(false);
  };

  const handleResetGame = () => {
    if (confirm('Are you sure? Your saved cybersecurity progress will be reset.')) {
      handleRestart();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 cyber-grid relative text-foreground overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Three.js Environment Background */}
      <ThreeBackground />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto">
        {gameState === 'start' && (
          <div className="w-full flex justify-center py-6">
            <StartScreen
              onStart={handleStart}
              onReset={handleResetGame}
              hasSavedGame={hasSavedGame}
            />
          </div>
        )}

        {gameState === 'playing' && (
          <div ref={levelContainerRef} className="w-full flex flex-col items-center">
            <GameHeader
              currentLock={currentLock}
              score={score}
              timeRemaining={timeRemaining}
              securityStatus={securityStatus}
              timerActive={timerActive}
            />

            <LockProgress currentLock={currentLock} />

            {/* Level 1: Phishing */}
            {currentLock === 1 && (
              <LockOne
                emails={EMAILS}
                score={score}
                setScore={setScore}
                onSuccess={() => handleLockSuccess(1)}
                setTimerActive={setTimerActive}
                onStatusChange={setSecurityStatus}
              />
            )}

            {/* Level 2: Encrypted Vault */}
            {currentLock === 2 && (
              <LockTwo
                score={score}
                setScore={setScore}
                onSuccess={() => handleLockSuccess(2)}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
                onStatusChange={setSecurityStatus}
              />
            )}

            {/* Level 3: Malware Trap */}
            {currentLock === 3 && (
              <LockThree
                score={score}
                setScore={setScore}
                onSuccess={() => handleLockSuccess(3)}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
                onStatusChange={setSecurityStatus}
              />
            )}

            {/* Level 4: Firewall */}
            {currentLock === 4 && (
              <LockFour
                score={score}
                setScore={setScore}
                onSuccess={() => handleLockSuccess(4)}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
                onStatusChange={setSecurityStatus}
              />
            )}

            {/* Level 5: System Recovery Climax */}
            {currentLock === 5 && (
              <LockFive
                score={score}
                setScore={setScore}
                onSuccess={() => handleLockSuccess(5)}
                currentLock={currentLock}
                setTimerActive={setTimerActive}
                onStatusChange={setSecurityStatus}
              />
            )}
          </div>
        )}

        {gameState === 'success' && (
          <SuccessScreen
            completedLock={completedLock || 1}
            onRestart={handleContinue}
          />
        )}

        {gameState === 'timeout' && (
          <GameOverScreen onRestart={handleRestart} />
        )}

        {gameState === 'insufficient-xp' && (
          <InsufficientXPScreen onRestart={handleRestart} />
        )}

        {gameState === 'complete' && (
          <FinalVictoryScreen score={score} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
