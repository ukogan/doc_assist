'use client';

import { useAccessibility } from '@/hooks/useAccessibility';
import { FontSize } from '@/app/lib/types';

const FONT_SIZES: { value: FontSize; label: string; preview: string }[] = [
  { value: 'normal', label: 'Normal text', preview: 'Aa' },
  { value: 'large', label: 'Large text', preview: 'Aa' },
  { value: 'xlarge', label: 'Extra large text', preview: 'Aa' },
];

export function FontSizeControl() {
  const { fontSize, setFontSize } = useAccessibility();

  return (
    <fieldset className="flex items-center gap-2" aria-label="Text size adjustment">
      <legend className="sr-only">Text Size</legend>

      {FONT_SIZES.map((size) => (
        <button
          key={size.value}
          onClick={() => setFontSize(size.value)}
          aria-pressed={fontSize === size.value}
          aria-label={size.label}
          className={`
            px-3 py-2 rounded-lg border-2 min-w-[44px] min-h-[44px]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              fontSize === size.value
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
          style={{
            fontSize:
              size.value === 'normal'
                ? '14px'
                : size.value === 'large'
                  ? '18px'
                  : '22px',
          }}
        >
          {size.preview}
        </button>
      ))}
    </fieldset>
  );
}
