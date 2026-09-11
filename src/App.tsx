import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import { setSessionLostHandler } from "./lib/api";
import { AppLayout } from "./components/layout/AppLayout";
import { GuestOnlyRoute, ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import TwoFactorPage from "./pages/TwoFactorPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SecurityPage from "./pages/SecurityPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

function RootRedirect() {
  const status = useAuthStore((s) => s.status);
  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const forceLogout = useAuthStore((s) => s.forceLogout);

  useEffect(() => {
    // Khi interceptor phát hiện phiên bị thu hồi ⇒ đẩy về guest kèm thông báo
    setSessionLostHandler(forceLogout);
    void bootstrap();
  }, [bootstrap, forceLogout]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Nhóm public: đã đăng nhập thì tự chuyển về dashboard */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/two-factor" element={<TwoFactorPage />} />
        </Route>

        {/* Callback OAuth luôn truy cập được để đổi token */}
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Nhóm cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Route>
        </Route>

        {/* Nhóm chỉ dành cho ADMIN */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
