import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Spinner } from "../components/Spinner";
import { Alert } from "../components/Alert";
import { authApi } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const applyResult = useAuthStore((s) => s.applyResult);

  // 1. Kiểm tra token và gán lỗi ngay từ lúc khởi tạo Component
  const [error, setError] = useState(() => {
    return !token ? "Thiếu mã xác thực từ nhà cung cấp" : "";
  });

  const exchanged = useRef(false);

  useEffect(() => {
    // 2. Chặn thực thi nếu đã fetch hoặc không có token
    if (exchanged.current || !token) return;
    exchanged.current = true;

    (async () => {
      try {
        const res = applyResult(await authApi.exchangeOAuth(token));

        if (res.status === "AUTHENTICATED") {
          navigate("/dashboard", { replace: true });
        } else if (res.status === "TWO_FACTOR_REQUIRED") {
          navigate("/two-factor", {
            replace: true,
            state: {
              challengeToken: res.challengeToken,
              method: res.method,
              message: res.message,
            },
          });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        setError(apiError(err, "Đăng nhập bằng mạng xã hội thất bại"));
      }
    })();
  }, [token, navigate, applyResult]);

  return (
    <AuthLayout
      title="Đang hoàn tất đăng nhập"
      subtitle="Vui lòng giữ nguyên trang này"
    >
      {error ? (
        <div className="space-y-4">
          <Alert variant="error">{error}</Alert>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="btn-primary"
          >
            Quay lại đăng nhập
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-slate-500">
          <Spinner className="h-8 w-8 text-brand-600" />
          <p className="text-sm">Đang xác thực tài khoản…</p>
        </div>
      )}
    </AuthLayout>
  );
}
