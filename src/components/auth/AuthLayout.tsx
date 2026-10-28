import type { ReactNode } from "react";
import logoImg from "../../assets/Logo.png";
import { useThemeStore } from "../../store/theme.store";
import { useI18nStore } from "../../store/i18n.store";
import { ShrimpHeroArtwork } from "./ShrimpHeroArtwork";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  isRegister = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  isRegister?: boolean;
}) {
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLang, t } = useI18nStore();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#ebf8ff] via-[#e6f9fc] to-[#bde6fd] dark:from-[#030712] dark:via-[#071324] dark:to-[#04203b] transition-colors duration-300 flex items-center justify-center p-3 sm:p-5 lg:p-6">
      {/* ─── 1. Decorative Aquatic Background Ambient ─── */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-300/20 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-sky-300/20 dark:bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Translucent Bubbles */}
      <div className="absolute top-10 left-[12%] w-8 h-8 rounded-full bg-white/40 dark:bg-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(6,182,212,0.15)] backdrop-blur-xs pointer-events-none animate-bounce [animation-duration:7s]" />
      <div className="absolute top-[30%] left-[3%] w-5 h-5 rounded-full bg-white/40 dark:bg-white/10 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),0_2px_8px_rgba(6,182,212,0.15)] backdrop-blur-xs pointer-events-none animate-pulse [animation-duration:4s]" />
      <div className="absolute bottom-[22%] left-[25%] w-10 h-10 rounded-full bg-white/40 dark:bg-white/10 shadow-[inset_0_2px_5px_rgba(255,255,255,0.8),0_6px_16px_rgba(6,182,212,0.15)] backdrop-blur-xs pointer-events-none animate-bounce [animation-duration:8s]" />
      <div className="absolute top-[16%] right-[6%] w-6 h-6 rounded-full bg-white/40 dark:bg-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_10px_rgba(6,182,212,0.15)] backdrop-blur-xs pointer-events-none animate-pulse [animation-duration:5s]" />

      {/* Subtle Aquatic Wave Curves along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden opacity-25 dark:opacity-15">
        <svg
          viewBox="0 0 1440 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M0,160 C320,280 420,80 720,180 C1020,280 1120,80 1440,160 L1440,280 L0,280 Z"
            fill="url(#waveGrad)"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ─── 2. Top Right Theme & Language Controls ─── */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLang}
          className="theme-toggle-btn shadow-xs bg-white/85 dark:bg-slate-900/85 backdrop-blur-md"
          title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        >
          <span>{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
          <span>{lang === "vi" ? "VI" : "EN"}</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn shadow-xs bg-white/85 dark:bg-slate-900/85 backdrop-blur-md"
          title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Switch to Dark mode"}
        >
          <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          <span>{theme === "dark" ? t("lightTheme") : t("darkTheme")}</span>
        </button>
      </div>

      {/* ─── 3. Main Container (2-Column Hero + Auth Card) ─── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-2 sm:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* ══════════════ LEFT COLUMN: HERO SHOWCASE ══════════════ */}
          <section className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full ring-3 ring-[#00a2db]/40 p-0.5 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={logoImg}
                    alt="shrimpAI"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  shrimp<span className="text-[#00a2db]">AI</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t("brandSub")}
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]">
                {t(isRegister ? "registerHeroTitle1" : "authHeroTitle1")}
                <span className="block text-slate-900 dark:text-white">
                  {t("authHeroTitle2")}
                  <span className="text-[#00a2db] drop-shadow-xs">
                    {t("authHeroTitleSystem")}
                  </span>
                </span>
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                {t("authHeroDesc")}
              </p>
            </div>

            {/* 3 Feature Pills / Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md">
              {/* Feature 1 */}
              <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-cyan-100/80 dark:border-cyan-900/40 shadow-xs flex flex-col items-center text-center gap-1.5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-[#00a2db] flex items-center justify-center">
                  <svg
                    className="w-4.5 h-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {t("featAiScan")}
                </span>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-cyan-100/80 dark:border-cyan-900/40 shadow-xs flex flex-col items-center text-center gap-1.5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-[#00a2db] flex items-center justify-center">
                  <svg
                    className="w-4.5 h-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {t("featAccuracy")}
                </span>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-cyan-100/80 dark:border-cyan-900/40 shadow-xs flex flex-col items-center text-center gap-1.5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-[#00a2db] flex items-center justify-center">
                  <svg
                    className="w-4.5 h-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {t("featFastEasy")}
                </span>
              </div>
            </div>

            {/* Visual Centerpiece Artwork (Shrimp with AI Viewfinder) */}
            <div className="pt-1 hidden sm:flex justify-center lg:justify-start">
              <ShrimpHeroArtwork />
            </div>
          </section>

          {/* ══════════════ RIGHT COLUMN: AUTH CARD ══════════════ */}
          <section className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-[410px] bg-white dark:bg-[#0c162c] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 lg:p-7 shadow-[0_15px_40px_rgba(2,132,199,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-cyan-100/80 dark:border-slate-800/80 transition-all">
              {/* Card Header: Circular Logo Badge & Title */}
              <div className="text-center mb-4 sm:mb-5">
                <div className="inline-block relative mb-2.5">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full ring-3 ring-cyan-100 dark:ring-cyan-900/50 p-0.5 bg-white shadow-sm mx-auto flex items-center justify-center overflow-hidden">
                    <img
                      src={logoImg}
                      alt="shrimpAI"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form & Actions */}
              <div>{children}</div>

              {/* Card Footer */}
              {footer && (
                <div className="mt-3.5 sm:mt-4 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {footer}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
