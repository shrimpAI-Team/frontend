import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled,
  autoFocus = true,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setAt = (i: number, char: string) => {
    const next = value.padEnd(length, " ").split("");
    next[i] = char;
    const joined = next.join("").replace(/\s/g, "").slice(0, length);
    onChange(joined);
    if (joined.length === length) onComplete?.(joined);
  };

  const handleChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    if (digits.length > 1) {
      const merged = (value + digits).replace(/\D/g, "").slice(0, length);
      onChange(merged);
      refs.current[Math.min(merged.length, length - 1)]?.focus();
      if (merged.length === length) onComplete?.(merged);
      return;
    }
    setAt(i, digits);
    refs.current[Math.min(i + 1, length - 1)]?.focus();
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.split("");
      if (arr[i]) {
        arr[i] = "";
        onChange(arr.join("").trimEnd());
      } else if (i > 0) {
        arr.splice(i - 1, 1);
        onChange(arr.join(""));
        refs.current[i - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft") refs.current[Math.max(i - 1, 0)]?.focus();
    if (e.key === "ArrowRight")
      refs.current[Math.min(i + 1, length - 1)]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(digits);
    refs.current[Math.min(digits.length, length - 1)]?.focus();
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <div
      className="flex justify-between gap-1.5 sm:gap-2.5"
      role="group"
      aria-label={`Nhập mã ${length} chữ số`}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Chữ số thứ ${i + 1}`}
          className="h-12 w-full max-w-[3.25rem] rounded-xl border border-slate-300 bg-white
                     text-center text-lg font-bold text-slate-800 outline-none transition
                     focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                     disabled:bg-slate-100 sm:h-14 sm:text-2xl"
        />
      ))}
    </div>
  );
}
