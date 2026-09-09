type Variant = "error" | "success" | "info" | "warning";

const STYLES: Record<Variant, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-brand-100 bg-brand-50 text-brand-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const ICONS: Record<Variant, string> = {
  error: "⛔",
  success: "✅",
  info: "ℹ️",
  warning: "⚠️",
};

export function Alert({
  variant = "info",
  children,
  onClose,
}: {
  variant?: Variant;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  if (!children) return null;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${STYLES[variant]}`}
    >
      <span aria-hidden="true">{ICONS[variant]}</span>
      <p className="flex-1 leading-relaxed">{children}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="shrink-0 rounded-md px-1 opacity-60 transition hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
