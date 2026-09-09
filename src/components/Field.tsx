import { forwardRef, useId, useState } from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, type = "text", id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
      <div>
        <label htmlFor={inputId} className="label">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && show ? "text" : type}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
            }
            className={`input ${isPassword ? "pr-12" : ""} ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                : ""
            }`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5
                         text-base text-slate-500 transition hover:bg-slate-100"
            >
              {show ? "🙈" : "👁️"}
            </button>
          )}
        </div>
        {error ? (
          <p
            id={`${inputId}-err`}
            className="mt-1.5 text-xs font-medium text-rose-600"
          >
            {error}
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
