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
      subtitle={t("loginSubtitle")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            to="/register"
            className="font-semibold text-cyan-600 hover:text-cyan-500 hover:underline"
          >
            {t("registerNow")}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
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

        <Field
          label={t("emailLabel")}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="ban@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Field
          label={t("passwordLabel")}
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Spinner />}
          {loading ? "..." : t("loginBtn")}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        {t("orSocial")}
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <OAuthButtons disabled={loading} />

      <p className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 px-3.5 py-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        🔒 Mỗi tài khoản chỉ hoạt động trên <b>một thiết bị</b> tại một thời
        điểm. Đăng nhập thiết bị mới sẽ tự động đăng xuất các thiết bị còn lại.
      </p>
    </AuthLayout>
  );
}
