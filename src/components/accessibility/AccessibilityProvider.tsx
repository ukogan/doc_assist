'use client';

import { ReactNode } from 'react';
import { AccessibilityContext, useAccessibilityState } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const accessibilityValue = useAccessibilityState();

  return (
    <AccessibilityContext.Provider value={accessibilityValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}
