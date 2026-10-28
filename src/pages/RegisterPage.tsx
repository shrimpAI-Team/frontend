import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Field } from "../components/ui/Field";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OAuthButtons } from "../components/auth/OAuthButtons";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useI18nStore } from "../store/i18n.store";

const rules = (pw: string) => [
  { ok: pw.length >= 8, text: "Tối thiểu 8 ký tự" },
  { ok: /[a-z]/.test(pw), text: "Có chữ thường" },
  { ok: /[A-Z]/.test(pw), text: "Có chữ hoa" },
  { ok: /\d/.test(pw), text: "Có chữ số" },
];

export default function RegisterPage() {
  const { t } = useI18nStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checks = useMemo(() => rules(form.password), [form.password]);
  const strength = checks.filter((c) => c.ok).length;
  const mismatch = !!form.confirm && form.confirm !== form.password;
  const valid = strength === 4 && !mismatch && !!form.email;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
      });
      navigate("/verify-otp", {
        state: { email: res.email, message: res.message },
      });
    } catch (err) {
      setError(apiError(err, "Đăng ký thất bại"));
    } finally {
      setLoading(false);
    }
  };

  const barColor =
    strength <= 1
      ? "bg-rose-500"
      : strength <= 3
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <AuthLayout
      title={t("registerTitle")}
      subtitle={t("registerCardSubtitle")}
      isRegister={true}
      footer={
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t("hasAccount")}{" "}
          <Link
            to="/login"
            className="font-bold text-[#00a2db] hover:text-[#008fc2] hover:underline transition ml-1"
          >
            {t("signInNow")}
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-3" noValidate>
        {error && (
          <Alert variant="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Name Field with User Icon */}
        <Field
          label={t("nameLabel")}
          name="name"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        {/* Email Field with Envelope Icon */}
        <Field
          label={t("emailLabel")}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Password Field with Lock Icon */}
        <div>
          <Field
            label={t("passwordLabel")}
            type="password"
            name="password"
            autoComplete="new-password"
            required
            placeholder={t("passwordPlaceholder")}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
          />
          {form.password && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <ul className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] sm:text-[11px]">
                {checks.map((c) => (
                  <li
                    key={c.text}
                    className={`flex items-center gap-1 font-medium ${
                      c.ok
                        ? "text-emerald-500"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <span>{c.ok ? "✓" : "○"}</span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <Field
          label={t("confirmPasswordLabel")}
          type="password"
          name="confirm"
          autoComplete="new-password"
          required
          placeholder={t("confirmPasswordPlaceholder")}
          error={mismatch ? "Mật khẩu nhập lại không khớp" : undefined}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          }
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !valid}
          className="w-full h-11 sm:h-11.5 rounded-xl bg-[#00a2db] hover:bg-[#008fc2] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,162,219,0.32)] transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Spinner />
          ) : (
            <svg
              className="w-4.5 h-4.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          )}
          <span>{loading ? "..." : t("registerBtn")}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-3 sm:my-3.5 flex items-center gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        {t("orSocialRegister")}
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Social Login Buttons */}
      <OAuthButtons disabled={loading} />
    </AuthLayout>
  );
}
