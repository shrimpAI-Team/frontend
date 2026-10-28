import logoImg from "../../assets/Logo.png";
import { useThemeStore } from "../../store/theme.store";
import { useI18nStore } from "../../store/i18n.store";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLang, t } = useI18nStore();

  return (
    <main
      className="relative grid min-h-dvh place-items-center bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[#030712] dark:via-[#090d16] dark:to-[#082f49]/30 px-4 py-8 sm:px-6 transition-colors"
    >
      {/* Top Controls: Language & Theme switchers */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLang}
          className="theme-toggle-btn"
          title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        >
          <span>{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
          <span>{lang === "vi" ? "VI" : "EN"}</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Switch to Dark mode"}
        >
          <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          <span>{theme === "dark" ? t("darkTheme") : t("lightTheme")}</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src={logoImg}
            alt="shrimpAI"
            className="mx-auto mb-3 h-16 w-16 object-contain rounded-full ring-4 ring-cyan-500/20 shadow-md transition hover:scale-105"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="card dark:bg-[#0f172a] dark:border-slate-800">{children}</div>

        {footer && (
          <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}

