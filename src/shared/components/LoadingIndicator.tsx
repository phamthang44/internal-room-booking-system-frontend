interface LoadingIndicatorProps {
  title: string;
  subtitle?: string;
}

/** One accessible loading status, independent of icon fonts and global keyframes. */
export function LoadingIndicator({ title, subtitle }: LoadingIndicatorProps) {
  return (
    <div role="status" aria-live="polite" className="flex max-w-sm flex-col items-center gap-5 px-6 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="h-8 w-8 text-primary motion-safe:animate-spin"
      >
        <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" opacity="0.12" />
        <path d="M16 3a13 13 0 0 1 13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        {subtitle && <p className="text-sm leading-relaxed text-on-surface-variant">{subtitle}</p>}
      </div>
    </div>
  );
}
