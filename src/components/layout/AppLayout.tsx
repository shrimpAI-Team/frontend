import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Alert } from "../ui/Alert";
import { AnalysisModal } from "../ui/AnalysisModal";
import logoImg from "../../assets/Logo.png";

export function AppLayout() {
  const { user, notice, setNotice, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  interface NavLinkItem {
    to: string;
    label: string;
    action?: () => void;
  }

  const navLinks: NavLinkItem[] = [
    { to: "/dashboard", label: "Trang chủ" },
    { to: "/chat", label: "Phân tích tôm" },
    { to: "/dashboard#history", label: "Lịch sử" },
    { to: "/about", label: "Giới thiệu" },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "Quản trị" }] : []),
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-11 w-11 object-contain rounded-full ring-2 ring-cyan-500/20 shadow-xs transition group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900">
                shrimp<span className="text-cyan-600">AI</span>
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((n) =>
              n.action ? (
                <button
                  key={n.label}
                  type="button"
                  onClick={n.action}
                  className="nav-tab-modern cursor-pointer"
                >
                  {n.label}
                </button>
              ) : (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `nav-tab-modern ${
                      isActive && !n.to.includes("#")
                        ? "nav-tab-active"
                        : ""
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right Action Bar: [Bắt đầu phân tích] + [User Chip khoanh đỏ] */}
          <div className="hidden items-center gap-3.5 md:flex">
            {/* Nút Bắt đầu phân tích */}
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="btn-cyan-glow shimmer-sweep"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current stroke-2"
                aria-hidden="true"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4 4-4 4 4" />
              </svg>
              <span>Bắt đầu phân tích</span>
            </button>

            {/* Cụm Auth Người dùng (giữ nguyên khoanh đỏ) */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 group"
                title="Bấm để vào trang Hồ sơ cá nhân"
              >
                <div className="text-right">
                  <p className="max-w-[150px] truncate text-sm font-bold text-slate-800 group-hover:text-cyan-700">
                    {user?.name ?? user?.email}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {user?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                  </p>
                </div>
                {user?.avatarUrl && !avatarError ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? "Avatar"}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setAvatarError(true)}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-600 text-sm font-bold text-white ring-2 ring-cyan-100 shadow-xs">
                    {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white"
            >
              Phân tích
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Mở menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-700"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-2">
            {navLinks.map((n) =>
              n.action ? (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    n.action?.();
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {n.label}
                </button>
              ) : (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive && !n.to.includes("#")
                        ? "bg-cyan-50 text-cyan-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              )
            )}
            <div className="border-t border-slate-100 pt-2">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                👤 Trang Hồ sơ cá nhân ({user?.name ?? user?.email})
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-600"
              >
                🚪 Đăng xuất
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {notice && (
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
            <Alert variant="warning" onClose={() => setNotice(null)}>
              {notice}
            </Alert>
          </div>
        )}
        <Outlet context={{ openAnalysisModal: () => setIsAnalysisModalOpen(true) }} />
      </main>

      {/* Interactive Analysis Modal */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
      />
    </div>
  );
}
