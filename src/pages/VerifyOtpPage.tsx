import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { OtpInput } from "../components/auth/OtpInput";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function VerifyOtpPage() {
  const { state } = useLocation() as {
    state?: { email?: string; message?: string };
  };
  const navigate = useNavigate();
  const applyResult = useAuthStore((s) => s.applyResult);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(state?.message ?? "");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!state?.email) return <Navigate to="/register" replace />;

  const verify = async (value: string) => {
    if (value.length !== 6 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = applyResult(
        await authApi.verifyEmail({ email: state.email!, code: value }),
      );
      if (res.status === "AUTHENTICATED")
        navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err, "Xác thực thất bại"));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      const r = await authApi.resendOtp(state.email!);
      setInfo(r.message);
      setCooldown(60);
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <AuthLayout
      title="Xác thực email"
      subtitle={`Mã 6 số đã gửi tới ${state.email}`}
    >
      <div className="space-y-5">
        {info && (
          <Alert variant="info" onClose={() => setInfo("")}>
            {info}
          </Alert>
        )}
        {error && (
          <Alert variant="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={verify}
          disabled={loading}
        />

        <button
          onClick={() => verify(code)}
          disabled={loading || code.length !== 6}
          className="btn-primary"
        >
          {loading && <Spinner />}
          {loading ? "Đang xác thực…" : "Xác nhận"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Chưa nhận được mã?{" "}
          {cooldown > 0 ? (
            <span className="font-medium text-slate-400">
              Gửi lại sau {cooldown}s
            </span>
          ) : (
            <button
              onClick={resend}
              className="font-semibold text-brand-600 hover:underline"
            >
              Gửi lại mã
            </button>
          )}
        </p>
      </div>
    </AuthLayout>
  );
}
