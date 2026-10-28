import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Field } from "../components/ui/Field";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OAuthButtons } from "../components/auth/OAuthButtons";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { useI18nStore } from "../store/i18n.store";

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { applyResult, notice, setNotice } = useAuthStore();
  const { t } = useI18nStore();

  const [error, setError] = useState(() => {
    const oauthErr = params.get("error");
    return oauthErr ? decodeURIComponent(oauthErr) : "";
  });

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = applyResult(await authApi.login(form));

      if (res.status === "AUTHENTICATED") {
        navigate("/dashboard", { replace: true });
      } else if (res.status === "TWO_FACTOR_REQUIRED") {
        navigate("/two-factor", {
          state: {
            challengeToken: res.challengeToken,
            method: res.method,
            message: res.message,
          },
        });
      } else {
        navigate("/verify-otp", {
          state: { email: res.email, message: res.message },
        });
      }
    } catch (err) {
      setError(apiError(err, "Đăng nhập thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("loginTitle")}
      subtitle={t("loginCardSubtitle")}
      isRegister={false}
      footer={
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t("noAccount")}{" "}
          <Link
            to="/register"
            className="font-bold text-[#00a2db] hover:text-[#008fc2] hover:underline transition ml-1"
          >
            {t("registerNow")}
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-3 sm:space-y-3.5" noValidate>
        {notice && (
          <Alert variant="warning" onClose={() => setNotice(null)}>
            {notice}
          </Alert>
        )}
        {error && (
          <Alert variant="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Email Field with Left Envelope Icon */}
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

        {/* Password Field with Left Lock Icon & Right "Quên mật khẩu?" */}
        <Field
          label={t("passwordLabel")}
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder={t("passwordPlaceholder")}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          rightAction={
            <button
              type="button"
              onClick={() =>
                alert(
                  "Vui lòng liên hệ Quản trị viên hệ thống shrimpAI để được hỗ trợ cấp lại mật khẩu.",
                )
              }
              className="hover:underline cursor-pointer text-xs font-semibold text-[#00a2db]"
            >
              {t("forgotPassword")}
            </button>
          }
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

        {/* Submit Button (Vibrant Cyan with Cloud/Arrow Icon) */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 sm:h-11.5 rounded-xl bg-[#00a2db] hover:bg-[#008fc2] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,162,219,0.32)] transition-all cursor-pointer disabled:opacity-60"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
          <span>{loading ? "..." : t("loginBtn")}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-3.5 sm:my-4 flex items-center gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        {t("orSocial")}
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Social Login Buttons: Google, Facebook, Zalo */}
      <OAuthButtons disabled={loading} />
    </AuthLayout>
  );
}
