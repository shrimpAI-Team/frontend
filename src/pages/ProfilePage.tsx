import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authApi, type SessionItem } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
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

export default function ProfilePage() {
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-600 transition"
        >
          ← Quay lại Trang chủ
        </Link>
      </div>

      {/* Banner thông tin người dùng */}
      <section className="rounded-3xl bg-gradient-to-r from-cyan-700 via-sky-700 to-teal-700 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider opacity-80">
              Quản lý tài khoản
            </p>
            <h1 className="mt-1.5 text-2xl font-black sm:text-3xl">
              {user?.name ?? user?.email}
            </h1>
            <p className="mt-1 text-sm text-cyan-100">{user?.email}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1 font-semibold backdrop-blur">
                {user?.role === "ADMIN" ? "👑 Quản trị viên" : "🙍 Người dùng"}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 font-semibold backdrop-blur">
                {user?.twoFactorEnabled ? "🔐 Đã bật 2FA" : "⚠️ Chưa bật 2FA"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/security"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-cyan-800 shadow-sm transition hover:bg-cyan-50"
            >
              🔐 Cài đặt bảo mật (2FA)
            </Link>
          </div>
        </div>
      </section>

      {/* Thẻ tóm tắt thông tin */}
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

      {/* Chi tiết tài khoản */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Chi tiết tài khoản</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Họ và tên</p>
            <p className="mt-1 font-semibold text-slate-800">{user?.name ?? "Chưa cập nhật"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-800">{user?.email}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">ID Người dùng</p>
            <p className="mt-1 font-mono text-xs text-slate-700">{user?.id}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Tài khoản liên kết</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {user?.oauthAccounts?.length
                ? user.oauthAccounts.map((a) => a.provider.toUpperCase()).join(", ")
                : "Tài khoản mật khẩu thông thường"}
            </p>
          </div>
        </div>
      </section>

      {/* Lịch sử thiết bị */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lịch sử thiết bị</h2>
            <p className="text-xs text-slate-500">Danh sách các thiết bị đã đăng nhập vào tài khoản của bạn</p>
          </div>
          <Link
            to="/security"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Quản lý bảo mật →
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
