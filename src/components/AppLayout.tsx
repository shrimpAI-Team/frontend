import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { Alert } from "./Alert";

const NAV = [
  { to: "/dashboard", label: "Tổng quan", icon: "🏠", adminOnly: false },
  { to: "/security", label: "Bảo mật", icon: "🔐", adminOnly: false },
  { to: "/admin", label: "Quản trị", icon: "👑", adminOnly: true },
];

export function AppLayout() {
  const { user, notice, setNotice, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const items = NAV.filter((n) => !n.adminOnly || user?.role === "ADMIN");

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600
                           font-black text-white"
          >
            A
          </span>
          <span className="font-bold text-slate-900">AuthDemo</span>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <span aria-hidden="true">{n.icon}</span> {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {user?.name ?? user?.email}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role === "ADMIN" ? "👑 Quản trị viên" : "Người dùng"}
              </p>
            </div>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-200
                               text-sm font-bold text-slate-600"
              >
                {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="hidden h-9 rounded-lg border border-slate-300 px-3 text-sm font-medium
                         text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Đăng xuất
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Mở menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 md:hidden"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
            {items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700"
                  }`
                }
              >
                <span aria-hidden="true">{n.icon}</span> {n.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm
                         font-medium text-rose-600"
            >
              🚪 Đăng xuất
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {notice && (
          <div className="mb-5">
            <Alert variant="warning" onClose={() => setNotice(null)}>
              {notice}
            </Alert>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
