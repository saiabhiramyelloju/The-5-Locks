import { animate } from 'animejs';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface AnimeParams {
  [key: string]: any;
}

/**
 * Runs an anime.js animation while respecting reduced motion and providing a cleanup function.
 */
export function safeAnimate(targets: any, params: AnimeParams) {
  if (prefersReducedMotion()) {
    // If reduced motion is requested, immediately set target values or shorten duration
    try {
      return animate(targets, {
        ...params,
        duration: 10,
        delay: 0,
      });
    } catch {
      return null;
    }
  }

  try {
    return animate(targets, params);
  } catch (err) {
    console.warn('Anime animation error:', err);
    return null;
  }
}

/**
 * Micro-interaction: Shake an element on error
 */
export function shakeTarget(target: HTMLElement | string) {
  if (prefersReducedMotion()) return null;
  return safeAnimate(target, {
    translateX: [-8, 8, -6, 6, -3, 3, 0],
    duration: 400,
    ease: 'outQuad',
  });
}

/**
 * Micro-interaction: Subtle success pulse
 */
export function pulseSuccessTarget(target: HTMLElement | string) {
  if (prefersReducedMotion()) return null;
  return safeAnimate(target, {
    scale: [1, 1.04, 1],
    duration: 500,
    ease: 'outElastic(1, .8)',
  });
}

/**
 * Animates a numeric counter display from fromVal to toVal
 */
export function animateCounter(
  fromVal: number,
  toVal: number,
  onUpdate: (val: number) => void,
  duration = 800
) {
  if (prefersReducedMotion() || fromVal === toVal) {
    onUpdate(toVal);
    return null;
  }

  const obj = { val: fromVal };
  return safeAnimate(obj, {
    val: toVal,
    duration,
    ease: 'outExpo',
    onUpdate: () => {
      onUpdate(Math.round(obj.val));
    },
  });
}
