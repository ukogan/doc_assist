'use client';

interface ComplexityButtonsProps {
  onSimpler: () => void;
  onDetail: () => void;
  disabled?: boolean;
}

export function ComplexityButtons({
  onSimpler,
  onDetail,
  disabled = false,
}: ComplexityButtonsProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Adjust explanation complexity">
      <button
        onClick={onSimpler}
        disabled={disabled}
        aria-label="Explain in simpler terms"
        className={`
          inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
          text-sm font-medium min-h-[44px]
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-gray-100 text-gray-700 hover:bg-gray-200
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
        Simpler
      </button>
      <button
        onClick={onDetail}
        disabled={disabled}
        aria-label="Show more detail"
        className={`
          inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
          text-sm font-medium min-h-[44px]
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-gray-100 text-gray-700 hover:bg-gray-200
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        More Detail
      </button>
    </div>
  );
}
