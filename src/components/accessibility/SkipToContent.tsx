'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4 focus:z-50
        focus:bg-blue-600 focus:text-white
        focus:px-4 focus:py-2 focus:rounded-lg
        focus:outline-none focus:ring-2 focus:ring-white
        font-semibold
      "
    >
      Skip to main content
    </a>
  );
}
