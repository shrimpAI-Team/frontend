import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      label,
      error,
      hint,
      type = "text",
      id,
      icon,
      rightAction,
      className,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 select-none"
          >
            {label}
          </label>
          {rightAction && (
            <div className="text-xs font-semibold text-[#00a2db] hover:text-[#008fc2] transition">
              {rightAction}
            </div>
          )}
        </div>

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={isPassword && show ? "text" : type}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
            }
            className={`h-11 sm:h-12 w-full rounded-xl border bg-white dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200 ${
              icon ? "pl-10 sm:pl-11" : "pl-3.5"
            } ${isPassword ? "pr-11" : "pr-3.5"} ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-950/50"
                : "border-slate-200 dark:border-slate-700/80 focus:border-[#00a2db] focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-950/50"
            } ${className ?? ""}`}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
            >
              {show ? (
                // Eye Off Icon
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                // Eye Icon
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-err`}
            className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1"
          >
            <span>⚠️</span> {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Field.displayName = "Field";
