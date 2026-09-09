import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Field } from "../components/Field";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { OAuthButtons } from "../components/OAuthButtons";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { applyResult, notice, setNotice } = useAuthStore();

  // Khởi tạo state error trực tiếp từ params, bỏ hoàn toàn useEffect
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
      title="Đăng nhập"
      subtitle="Truy cập tài khoản của bạn một cách an toàn"
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:underline"
          >
            Đăng ký ngay
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
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="ban@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Field
          label="Mật khẩu"
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
          {loading ? "Đang xử lý…" : "Đăng nhập"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        hoặc
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <OAuthButtons disabled={loading} />

      <p className="mt-5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
        🔒 Mỗi tài khoản chỉ hoạt động trên <b>một thiết bị</b> tại một thời
        điểm. Đăng nhập thiết bị mới sẽ tự động đăng xuất các thiết bị còn lại.
      </p>
    </AuthLayout>
  );
}
