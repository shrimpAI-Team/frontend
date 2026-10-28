import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useThemeStore } from "../../store/theme.store";
import { useI18nStore } from "../../store/i18n.store";
import { Alert } from "../ui/Alert";
import { AnalysisModal } from "../ui/AnalysisModal";
import logoImg from "../../assets/Logo.png";

export function AppLayout() {
  const { user, notice, setNotice, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLang, t } = useI18nStore();
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
    { to: "/dashboard", label: t("home") },
    { to: "/chat", label: t("analysis") },
    { to: "/dashboard#history", label: t("history") },
    { to: "/about", label: t("about") },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: t("admin") }] : []),
  ];

  return (
    <div
      className="min-h-dvh flex flex-col bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors"
      style={{ backgroundColor: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur shadow-xs transition-colors"
        style={{ backgroundColor: "var(--bg-header)", borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-11 w-11 object-contain rounded-full ring-2 ring-cyan-500/20 shadow-xs transition group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                shrimp<span className="text-cyan-600 dark:text-cyan-400">AI</span>
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

          {/* Right Action Bar: [Language] + [Theme] + [Admin Portal] + [Bắt đầu phân tích] + [User Chip] */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              className="theme-toggle-btn"
              title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              <span>{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
              <span>{lang === "vi" ? "VI" : "EN"}</span>
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Switch to Dark mode"}
            >
              <span>{theme === "dark" ? "🌙" : "☀️"}</span>
              <span>{theme === "dark" ? t("darkTheme") : t("lightTheme")}</span>
            </button>

            {user?.role === "ADMIN" && (
              <a
                href={import.meta.env.VITE_ADMIN_PORTAL_URL || "http://localhost:5175"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition shadow-xs"
                title="Mở Cổng Quản Trị Hệ Thống chuyên biệt"
              >
                <span>👑</span>
                <span>{t("adminPortal")}</span>
              </a>
            )}

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
              <span>{t("startAnalysis")}</span>
            </button>

            {/* Cụm Auth Người dùng */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-2.5">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 group"
                title="Bấm để vào trang Hồ sơ cá nhân"
              >
                <div className="text-right">
                  <p className="max-w-[140px] truncate text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {user?.name ?? user?.email}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {user?.role === "ADMIN" ? t("adminRole") : t("userRole")}
                  </p>
                </div>
                {user?.avatarUrl && !avatarError ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? "Avatar"}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setAvatarError(true)}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-600 text-sm font-bold text-white ring-2 ring-cyan-100 dark:ring-cyan-900 shadow-xs">
                    {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 transition"
              >
                {t("logout")}
              </button>
            </div>
          </div>

          {/* Mobile buttons: Language + Theme + Analysis + Hamburger */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={toggleLang}
              className="theme-toggle-btn !p-1.5"
              title="Ngôn ngữ"
            >
              <span>{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn !p-1.5"
              title="Giao diện"
            >
              <span>{theme === "dark" ? "🌙" : "☀️"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="rounded-xl bg-cyan-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              {t("analysis")}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t("openMenu")}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <nav className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] px-4 py-3 md:hidden space-y-2">
            {navLinks.map((n) =>
              n.action ? (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    n.action?.();
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                        ? "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              )
            )}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                👤 {t("profile")} ({user?.name ?? user?.email})
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                🚪 {t("logout")}
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
