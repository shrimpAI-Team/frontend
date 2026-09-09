import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authApi, type SessionItem } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { getDeviceId } from "../lib/device";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));

const REASON_LABEL: Record<string, string> = {
  NEW_DEVICE_LOGIN: "Thiết bị mới đăng nhập",
  RE_LOGIN_SAME_DEVICE: "Đăng nhập lại cùng thiết bị",
  ROTATED: "Làm mới token",
  LOGOUT: "Người dùng đăng xuất",
  LOGOUT_ALL_DEVICES: "Đăng xuất toàn bộ",
  ROLE_CHANGED: "Thay đổi vai trò",
  ACCOUNT_DISABLED: "Tài khoản bị khoá",
  DEVICE_MISMATCH: "Thiết bị không khớp",
  REFRESH_TOKEN_REUSE: "Phát hiện tái sử dụng token",
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentDeviceId = getDeviceId();

  useEffect(() => {
    let alive = true;
    authApi
      .sessions()
      .then((d) => alive && setSessions(d))
      .catch((e) => alive && setError(apiError(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const active = sessions.filter((s) => !s.revokedAt);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white sm:p-8">
        <p className="text-sm/relaxed opacity-80">Xin chào 👋</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {user?.name ?? user?.email}
        </h1>
        <p className="mt-2 text-sm opacity-90">
          {user?.role === "ADMIN" ? "👑 Quản trị viên" : "🙍 Người dùng"} ·{" "}
          {user?.twoFactorEnabled ? "🔐 Đã bật 2FA" : "⚠️ Chưa bật 2FA"}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Phiên đang hoạt động"
          value={String(active.length)}
          icon="📶"
        />
        <StatCard
          label="Xác thực hai yếu tố"
          value={
            user?.twoFactorEnabled
              ? user.twoFactorMethod === "TOTP"
                ? "TOTP"
                : "Email OTP"
              : "Tắt"
          }
          icon="🔐"
        />
        <StatCard label="Vai trò" value={user?.role ?? "—"} icon="🎫" />
      </div>

      {!user?.twoFactorEnabled && (
        <Alert variant="warning">
          Tài khoản chưa bật xác thực hai yếu tố.{" "}
          <Link to="/security" className="font-semibold underline">
            Bật ngay
          </Link>{" "}
          để tăng mức bảo vệ.
        </Alert>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Lịch sử thiết bị</h2>
          <Link
            to="/security"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Quản lý →
          </Link>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-8 text-brand-600">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sessions.map((s) => {
              const isCurrent = !s.revokedAt && s.deviceId === currentDeviceId;
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3"
                >
                  <span aria-hidden="true" className="text-lg">
                    {s.revokedAt ? "🚫" : isCurrent ? "✅" : "📱"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {s.deviceName ?? "Thiết bị không xác định"}
                      {isCurrent && (
                        <span className="ml-2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          Thiết bị này
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      IP {s.ip ?? "n/a"} · {fmt(s.createdAt)}
                      {s.revokedAt &&
                        ` · ${REASON_LABEL[s.revokedReason ?? ""] ?? "Đã thu hồi"}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.revokedAt
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {s.revokedAt ? "Đã thu hồi" : "Đang hoạt động"}
                  </span>
                </li>
              );
            })}
            {!sessions.length && (
              <li className="py-8 text-center text-sm text-slate-400">
                Chưa có dữ liệu phiên
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">
        <span aria-hidden="true">{icon}</span> {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
