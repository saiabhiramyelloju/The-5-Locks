"use client";

import React from 'react';
import { Orb, type OrbState, type OrbVariant } from '@yogesharc/thinking-orbs';

export type SecurityStatus =
  | 'idle'
  | 'analyzing'
  | 'monitoring'
  | 'reasoning'
  | 'processing'
  | 'success'
  | 'error'
  | 'securing'
  | 'verifying'
  | 'secured';

interface StatusConfig {
  state: OrbState;
  variant?: any;
  colorClass: string;
  glowColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  labelText: string;
}

const STATUS_MAP: Record<SecurityStatus, StatusConfig> = {
  idle: {
    state: 'waiting',
    variant: 'default',
    colorClass: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    badgeBg: 'bg-cyan-950/40',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    labelText: 'SYSTEM ACTIVE',
  },
  analyzing: {
    state: 'searching',
    variant: 'lighthouse',
    colorClass: 'text-cyan-300',
    glowColor: 'rgba(34, 211, 238, 0.35)',
    badgeBg: 'bg-cyan-950/50',
    badgeBorder: 'border-cyan-400/50',
    badgeText: 'text-cyan-300',
    labelText: 'ANALYZING',
  },
  monitoring: {
    state: 'searching',
    variant: 'lighthouse',
    colorClass: 'text-teal-400',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    badgeBg: 'bg-teal-950/50',
    badgeBorder: 'border-teal-400/50',
    badgeText: 'text-teal-300',
    labelText: 'MONITORING',
  },
  reasoning: {
    state: 'reasoning',
    variant: 'twins',
    colorClass: 'text-indigo-400',
    glowColor: 'rgba(129, 140, 248, 0.35)',
    badgeBg: 'bg-indigo-950/50',
    badgeBorder: 'border-indigo-400/50',
    badgeText: 'text-indigo-300',
    labelText: 'REASONING',
  },
  processing: {
    state: 'working',
    variant: 'gyro',
    colorClass: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    badgeBg: 'bg-amber-950/50',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-300',
    labelText: 'PROCESSING',
  },
  success: {
    state: 'background',
    variant: 'spiral',
    colorClass: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    badgeBg: 'bg-emerald-950/50',
    badgeBorder: 'border-emerald-400/60',
    badgeText: 'text-emerald-300',
    labelText: 'ACCESS GRANTED',
  },
  error: {
    state: 'retrying',
    variant: 'surge',
    colorClass: 'text-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    badgeBg: 'bg-rose-950/50',
    badgeBorder: 'border-rose-500/60',
    badgeText: 'text-rose-300',
    labelText: 'SECURITY ALERT',
  },
  securing: {
    state: 'compacting',
    variant: 'squeeze',
    colorClass: 'text-teal-400',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    badgeBg: 'bg-teal-950/50',
    badgeBorder: 'border-teal-400/50',
    badgeText: 'text-teal-300',
    labelText: 'SECURING SYSTEM',
  },
  verifying: {
    state: 'compacting',
    variant: 'fuse',
    colorClass: 'text-emerald-300',
    glowColor: 'rgba(110, 231, 183, 0.4)',
    badgeBg: 'bg-emerald-950/50',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-200',
    labelText: 'VERIFYING SYSTEM',
  },
  secured: {
    state: 'background',
    variant: 'spiral',
    colorClass: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.55)',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-400/70',
    badgeText: 'text-emerald-300',
    labelText: 'SYSTEM SECURED',
  },
};

interface SecurityCoreProps {
  status?: SecurityStatus;
  size?: number | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showLabel?: boolean;
  labelOverride?: string;
  className?: string;
  speed?: number;
  interactive?: boolean;
  withRings?: boolean;
}

export const SecurityCore: React.FC<SecurityCoreProps> = ({
  status = 'idle',
  size = 'md',
  showLabel = false,
  labelOverride,
  className = '',
  speed = 1,
  interactive = false,
  withRings = false,
}) => {
  const config = STATUS_MAP[status] || STATUS_MAP.idle;

  const resolvedSize = typeof size === 'number'
    ? size
    : size === 'sm'
    ? 22
    : size === 'md'
    ? 38
    : size === 'lg'
    ? 56
    : size === 'xl'
    ? 76
    : size === 'hero'
    ? 96
    : 38;

  const displayLabel = labelOverride || config.labelText;
  const isLarge = resolvedSize >= 50;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center transition-all duration-500"
        style={{
          width: resolvedSize + (withRings ? 28 : 12),
          height: resolvedSize + (withRings ? 28 : 12),
        }}
      >
        {/* Ambient atmospheric glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700"
          style={{
            backgroundColor: config.glowColor,
            transform: 'scale(1.2)',
          }}
        />

        {/* Futuristic reticle rings if enabled or large size */}
        {(withRings || isLarge) && (
          <>
            <div
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-spin pointer-events-none"
              style={{ animationDuration: '24s' }}
            />
            <div
              className="absolute inset-2 rounded-full border border-dotted border-white/10 pointer-events-none animate-spin"
              style={{ animationDuration: '16s', animationDirection: 'reverse' }}
            />
          </>
        )}

        {/* The Thinking Orb component */}
        <div
          className={`relative z-10 flex items-center justify-center transition-colors duration-500 ${config.colorClass}`}
        >
          <Orb
            state={config.state}
            variant={config.variant}
            size={resolvedSize}
            speed={speed}
            label={displayLabel}
            className={config.colorClass}
          />
        </div>
      </div>

      {showLabel && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-xs tracking-widest uppercase transition-all duration-300 backdrop-blur-md ${config.badgeBg} ${config.badgeBorder} ${config.badgeText}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: 'currentColor' }}
          />
          <span>{displayLabel}</span>
        </div>
      )}
    </div>
  );
};
