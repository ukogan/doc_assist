'use client';

import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/app/lib/types';

interface UseSessionReturn {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
  createSession: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();

        if (data.valid && data.session) {
          setSession(data.session);
          // Check if disclaimer was previously accepted (stored in localStorage)
          const accepted = localStorage.getItem(
            `disclaimer_${data.session.id}`
          );
          setDisclaimerAccepted(accepted === 'true');
        }
      } catch (err) {
        console.error('Failed to check session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  // Create a new session
  const createNewSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/session', { method: 'POST' });
      const data = await response.json();

      if (data.success && data.session) {
        setSession(data.session);
        setDisclaimerAccepted(false);
      } else {
        setError(data.error || 'Failed to create session');
      }
    } catch (err) {
      setError('Network error creating session');
      console.error('Failed to create session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Accept disclaimer
  const acceptDisclaimer = useCallback(() => {
    if (session) {
      localStorage.setItem(`disclaimer_${session.id}`, 'true');
      setDisclaimerAccepted(true);
    }
  }, [session]);

  return {
    session,
    isLoading,
    error,
    disclaimerAccepted,
    acceptDisclaimer,
    createSession: createNewSession,
  };
}
