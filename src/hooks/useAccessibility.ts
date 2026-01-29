'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { FontSize } from '@/app/lib/types';

interface AccessibilityState {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  setFontSize: (size: FontSize) => void;
  setHighContrast: (enabled: boolean) => void;
  fontSizeClass: string;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

export function useAccessibilityState(): AccessibilityContextValue {
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load saved preferences and detect system settings
  useEffect(() => {
    // Load from localStorage
    const savedFontSize = localStorage.getItem('a11y_fontSize') as FontSize | null;
    const savedContrast = localStorage.getItem('a11y_highContrast');

    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedContrast) setHighContrastState(savedContrast === 'true');

    // Detect system reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Apply settings to document
  useEffect(() => {
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.documentElement.classList.add(`font-${fontSize}`);

    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [fontSize, highContrast, reducedMotion]);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('a11y_fontSize', size);
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('a11y_highContrast', String(enabled));
  }, []);

  const fontSizeClass =
    fontSize === 'normal'
      ? 'text-base'
      : fontSize === 'large'
        ? 'text-lg'
        : 'text-xl';

  return {
    fontSize,
    highContrast,
    reducedMotion,
    setFontSize,
    setHighContrast,
    fontSizeClass,
  };
}

export { AccessibilityContext };
