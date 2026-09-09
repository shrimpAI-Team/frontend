import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Field } from "../components/ui/Field";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OAuthButtons } from "../components/auth/OAuthButtons";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";

const rules = (pw: string) => [
  { ok: pw.length >= 8, text: "Tối thiểu 8 ký tự" },
  { ok: /[a-z]/.test(pw), text: "Có chữ thường" },
  { ok: /[A-Z]/.test(pw), text: "Có chữ hoa" },
  { ok: /\d/.test(pw), text: "Có chữ số" },
];

export default function RegisterPage() {
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
      title="Tạo tài khoản"
      subtitle="Chỉ mất chưa tới một phút"
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:underline"
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <Alert variant="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Field
          label="Họ và tên"
          name="name"
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="ban@example.com"
          hint="Mã OTP xác thực sẽ được gửi tới email này"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div>
          <Field
            label="Mật khẩu"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {form.password && (
            <>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {checks.map((c) => (
                  <li
                    key={c.text}
                    className={c.ok ? "text-emerald-600" : "text-slate-400"}
                  >
                    {c.ok ? "✓" : "○"} {c.text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <Field
          label="Xác nhận mật khẩu"
          type="password"
          name="confirm"
          autoComplete="new-password"
          required
          error={mismatch ? "Mật khẩu nhập lại không khớp" : undefined}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading || !valid}
          className="btn-primary"
        >
          {loading && <Spinner />}
          {loading ? "Đang tạo tài khoản…" : "Đăng ký"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        hoặc
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <OAuthButtons disabled={loading} />
    </AuthLayout>
  );
}
