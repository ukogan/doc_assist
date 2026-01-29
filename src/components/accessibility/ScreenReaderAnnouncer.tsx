'use client';

import { useEffect, useRef, useState } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function ScreenReaderAnnouncer({
  message,
  priority = 'polite',
}: ScreenReaderAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (message) {
      // Clear previous announcement
      setAnnouncement('');

      // Small delay to ensure screen readers pick up the change
      timeoutRef.current = setTimeout(() => {
        setAnnouncement(message);
      }, 100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
