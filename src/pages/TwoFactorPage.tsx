// src/pages/TwoFactorPage.tsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { OtpInput } from "../components/OtpInput";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { authApi, type TwoFactorMethod } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function TwoFactorPage() {
  const { state } = useLocation() as {
    state?: {
      challengeToken?: string;
      method?: TwoFactorMethod;
      message?: string;
    };
  };
  const navigate = useNavigate();
  const applyResult = useAuthStore((s) => s.applyResult);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.challengeToken) return <Navigate to="/login" replace />;

  const isTotp = state.method === "TOTP";

  const verify = async (value: string) => {
    if (value.length !== 6 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = applyResult(
        await authApi.verify2fa({
          challengeToken: state.challengeToken!,
          code: value,
        }),
      );
      if (res.status === "AUTHENTICATED")
        navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err, "Mã xác thực không đúng"));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Xác thực hai yếu tố"
      subtitle={
        isTotp ? "Mở ứng dụng Authenticator của bạn" : "Kiểm tra hộp thư email"
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {isTotp ? "📱" : "📧"} {state.message ?? "Nhập mã 6 số để tiếp tục"}
        </div>

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

        <button
          onClick={() => navigate("/login", { replace: true })}
          className="btn-ghost"
        >
          Quay lại đăng nhập
        </button>

        <p className="text-center text-xs text-slate-400">
          ⏱️ Phiên xác thực hết hạn sau 5 phút
        </p>
      </div>
    </AuthLayout>
  );
}
