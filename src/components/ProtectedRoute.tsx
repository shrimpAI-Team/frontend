import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { FullPageLoader } from "./Spinner";
import type { Role } from "../api/auth.api";

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status === "loading")
    return <FullPageLoader label="Đang xác thực phiên…" />;
  if (status === "guest" || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const status = useAuthStore((s) => s.status);
  if (status === "loading") return <FullPageLoader />;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
