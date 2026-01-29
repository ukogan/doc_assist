'use client';

import { useAccessibility } from '@/hooks/useAccessibility';

export function ContrastToggle() {
  const { highContrast, setHighContrast } = useAccessibility();

  return (
    <button
      onClick={() => setHighContrast(!highContrast)}
      aria-pressed={highContrast}
      aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border-2 min-h-[44px]
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          highContrast
            ? 'border-black bg-black text-white'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <span
        className={`
          w-5 h-5 rounded border-2
          ${highContrast ? 'bg-white border-white' : 'bg-gray-900 border-gray-900'}
        `}
        aria-hidden="true"
      />
      <span className="font-medium">
        {highContrast ? 'High Contrast On' : 'High Contrast'}
      </span>
    </button>
  );
}
