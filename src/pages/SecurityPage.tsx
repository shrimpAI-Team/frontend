import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { Alert } from "../components/Alert";
import { Field } from "../components/Field";
import { OtpInput } from "../components/OtpInput";
import { Spinner } from "../components/Spinner";

type Step = "idle" | "totp-setup" | "disable-confirm";

export default function SecurityPage() {
  const { user, refreshUser, logoutAll } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("idle");
  const [qr, setQr] = useState<{ qrDataUrl: string; secret: string } | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => {
    setStep("idle");
    setQr(null);
    setCode("");
    setPassword("");
    setError("");
  };

  /** Bật 2FA: EMAIL_OTP xong ngay, TOTP cần bước quét QR */
  const enable = async (method: "EMAIL_OTP" | "TOTP") => {
    setError("");
    setLoading(true);
    try {
      const res = await authApi.enable2fa(method);
      if (res.status === "TOTP_SETUP_PENDING") {
        setQr({ qrDataUrl: res.qrDataUrl, secret: res.secret });
        setStep("totp-setup");
      } else {
        setSuccess(res.message);
        await refreshUser();
      }
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  const confirmTotp = async (value: string) => {
    if (value.length !== 6 || loading) return;
    setError("");
    setLoading(true);
    try {
      await authApi.confirmTotp(value);
      await refreshUser();
      setSuccess("Đã bật xác thực hai yếu tố bằng ứng dụng Authenticator");
      reset();
    } catch (e) {
      setError(apiError(e));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  /** Tắt 2FA: gửi OTP email trước, sau đó xác nhận cùng mật khẩu */
  const requestDisable = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await authApi.requestDisable2fa();
      setSuccess(r.message);
      setStep("disable-confirm");
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  const disable = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !password) return;
    setError("");
    setLoading(true);
    try {
      const r = await authApi.disable2fa({ password, code });
      await refreshUser();
      setSuccess(r.message);
      reset();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Bảo mật tài khoản</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý xác thực hai yếu tố và các phiên đăng nhập
        </p>
      </header>

      {success && (
        <Alert variant="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">
              Xác thực hai yếu tố (2FA)
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lớp bảo vệ thứ hai mỗi khi đăng nhập
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              user?.twoFactorEnabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {user?.twoFactorEnabled
              ? `Đang bật · ${user.twoFactorMethod}`
              : "Đang tắt"}
          </span>
        </div>

        <div className="mt-5">
          {/* ── Chưa bật: chọn phương thức ── */}
          {!user?.twoFactorEnabled && step === "idle" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                icon="📧"
                title="Email OTP"
                desc="Nhận mã 6 số qua email mỗi lần đăng nhập"
                onClick={() => enable("EMAIL_OTP")}
                disabled={loading}
              />
              <MethodCard
                icon="📱"
                title="Authenticator"
                desc="Dùng Google Authenticator, Authy hoặc 1Password"
                onClick={() => enable("TOTP")}
                disabled={loading}
                recommended
              />
            </div>
          )}

          {/* ── Bước quét QR cho TOTP ── */}
          {step === "totp-setup" && qr && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Quét mã QR bằng ứng dụng Authenticator, sau đó nhập mã 6 số hiển
                thị.
              </p>
              <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-5">
                <img
                  src={qr.qrDataUrl}
                  alt="Mã QR cấu hình TOTP"
                  className="h-44 w-44 rounded-lg bg-white p-2"
                />
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Không quét được? Nhập thủ công:
                  </p>
                  <code className="mt-1 block break-all rounded-md bg-white px-2 py-1 text-xs font-semibold tracking-wider text-slate-700">
                    {qr.secret}
                  </code>
                </div>
              </div>

              <OtpInput
                value={code}
                onChange={setCode}
                onComplete={confirmTotp}
                disabled={loading}
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => confirmTotp(code)}
                  disabled={loading || code.length !== 6}
                  className="btn-primary"
                >
                  {loading && <Spinner />} Xác nhận
                </button>
                <button
                  onClick={reset}
                  className="btn-ghost"
                  disabled={loading}
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}

          {/* ── Đang bật: yêu cầu tắt ── */}
          {user?.twoFactorEnabled && step === "idle" && (
            <button
              onClick={requestDisable}
              disabled={loading}
              className="btn-ghost"
            >
              {loading && <Spinner />} Tắt xác thực hai yếu tố
            </button>
          )}

          {/* ── Xác nhận tắt: mật khẩu + OTP email ── */}
          {step === "disable-confirm" && (
            <form onSubmit={disable} className="space-y-4">
              <Alert variant="warning">
                Nhập mật khẩu và mã OTP vừa gửi tới email để xác nhận tắt 2FA.
              </Alert>

              <Field
                label="Mật khẩu hiện tại"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div>
                <span className="label">Mã xác nhận</span>
                <OtpInput
                  value={code}
                  onChange={setCode}
                  disabled={loading}
                  autoFocus={false}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={loading || code.length !== 6 || !password}
                  className="btn-primary"
                >
                  {loading && <Spinner />} Xác nhận tắt
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-ghost"
                  disabled={loading}
                >
                  Huỷ
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 sm:p-6">
        <h2 className="font-bold text-rose-800">Vùng nguy hiểm</h2>
        <p className="mt-1 text-sm text-rose-700/80">
          Thu hồi toàn bộ phiên đăng nhập trên mọi thiết bị, kể cả thiết bị hiện
          tại.
        </p>
        <button
          onClick={handleLogoutAll}
          className="mt-4 h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          🚪 Đăng xuất toàn bộ thiết bị
        </button>
      </section>
    </div>
  );
}

function MethodCard({
  icon,
  title,
  desc,
  onClick,
  disabled,
  recommended,
}: {
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
  recommended?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative rounded-xl border border-slate-200 p-4 text-left transition
                 hover:border-brand-400 hover:bg-brand-50/50 disabled:opacity-60"
    >
      {recommended && (
        <span className="absolute right-3 top-3 rounded-md bg-brand-100 px-1.5 py-0.5 text-[11px] font-bold text-brand-700">
          Khuyên dùng
        </span>
      )}
      <span aria-hidden="true" className="text-2xl">
        {icon}
      </span>
      <p className="mt-2 font-semibold text-slate-800">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
    </button>
  );
}
