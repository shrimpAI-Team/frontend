export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function FullPageLoader({ label = "Đang tải…" }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8 text-brand-600" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}
