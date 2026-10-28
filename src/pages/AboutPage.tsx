import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnalysisModal } from "../components/ui/AnalysisModal";
import logoImg from "../assets/Logo.png";
import shrimpSampleImg from "../assets/shrimp_sample.jpg";
import shrimpHeroScannerImg from "../assets/shrimp_hero_scanner.jpg";
import shrimpBlackTigerImg from "../assets/shrimp_black_tiger.jpg";
import shrimpGiantPrawnImg from "../assets/shrimp_giant_prawn.jpg";
import { useI18nStore } from "../store/i18n.store";

export default function AboutPage() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { t } = useI18nStore();

  const aboutScannerSlides = [
    {
      name: t("the_chan_trang"),
      scientificName: "Litopenaeus vannamei",
      confidence: "96.8%",
      image: shrimpHeroScannerImg,
    },
    {
      name: t("tom_su"),
      scientificName: "Penaeus monodon",
      confidence: "98.4%",
      image: shrimpBlackTigerImg,
    },
    {
      name: t("tom_cang_xanh"),
      scientificName: "Macrobrachium rosenbergii",
      confidence: "97.5%",
      image: shrimpGiantPrawnImg,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % aboutScannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [aboutScannerSlides.length]);

  // 4 Trụ cột công nghệ cốt lõi
  const pillars = [
    {
      icon: (
        <svg className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: t("pillar1Badge"),
      title: t("pillar1Title"),
      desc: t("pillar1Desc"),
      highlights: [t("pillar1H1"), t("pillar1H2"), t("pillar1H3")],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: t("pillar2Badge"),
      title: t("pillar2Title"),
      desc: t("pillar2Desc"),
      highlights: [t("pillar2H1"), t("pillar2H2"), t("pillar2H3")],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: t("pillar3Badge"),
      title: t("pillar3Title"),
      desc: t("pillar3Desc"),
      highlights: [t("pillar3H1"), t("pillar3H2"), t("pillar3H3")],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      badge: t("pillar4Badge"),
      title: t("pillar4Title"),
      desc: t("pillar4Desc"),
      highlights: [t("pillar4H1"), t("pillar4H2"), t("pillar4H3")],
    },
  ];

  // Tiêu chí đánh giá
  const criteria = [
    {
      name: t("crit1Name"),
      detail: t("crit1Detail"),
      status: t("crit1Status"),
      confidence: "96.8%",
      badgeColor: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    },
    {
      name: t("crit2Name"),
      detail: t("crit2Detail"),
      status: t("crit2Status"),
      confidence: "95.2%",
      badgeColor: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    },
    {
      name: t("crit3Name"),
      detail: t("crit3Detail"),
      status: t("crit3Status"),
      confidence: "94.5%",
      badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    {
      name: t("crit4Name"),
      detail: t("crit4Detail"),
      status: t("crit4Status"),
      confidence: t("crit4Conf"),
      badgeColor: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    },
    {
      name: t("crit5Name"),
      detail: t("crit5Detail"),
      status: t("crit5Status"),
      confidence: t("crit5Conf"),
      badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
  ];

  // Đối tượng ứng dụng
  const applications = [
    {
      title: t("app1Title"),
      desc: t("app1Desc"),
      icon: "🦐",
      tag: t("app1Tag"),
    },
    {
      title: t("app2Title"),
      desc: t("app2Desc"),
      icon: "🧪",
      tag: t("app2Tag"),
    },
    {
      title: t("app3Title"),
      desc: t("app3Desc"),
      icon: "🤝",
      tag: t("app3Tag"),
    },
    {
      title: t("app4Title"),
      desc: t("app4Desc"),
      icon: "🏢",
      tag: t("app4Tag"),
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* ════════════════════════ HERO HEADER ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sky-100 dark:border-slate-800 bg-gradient-to-b from-sky-50/60 via-white to-white dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-900 p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
          {/* Background Ambient Circles */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-100/50 dark:bg-cyan-900/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 dark:border-cyan-800 bg-cyan-50/90 dark:bg-cyan-950/60 px-3.5 py-1.5 text-xs font-black tracking-wide text-cyan-800 dark:text-cyan-300 shadow-2xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>{t("aboutHeroBadge")}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
              {t("aboutHeroTitle")}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed">
              {t("aboutHeroSubtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAnalysisModalOpen(true)}
                className="btn-cyan-glow shimmer-sweep px-6 py-3 text-sm rounded-xl cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4 4-4 4 4" />
                </svg>
                <span>{t("aboutExploreBtn")}</span>
              </button>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-cyan-300 dark:hover:border-cyan-600 hover:text-cyan-700 dark:hover:text-cyan-400 hover:shadow-sm transition-all"
              >
                <span>{t("aboutBackHome")}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ MỤC TIÊU & BỐI CẢNH ĐỀ TÀI ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left: Project Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                {t("aboutProjectSignificance")}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                {t("aboutSignificanceTitle")}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("aboutSignificanceP1")}
            </p>

            <div className="rounded-2xl border-l-4 border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/40 p-5 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-cyan-900 dark:text-cyan-200 leading-relaxed">
                {t("aboutSignificanceQuote")}
              </p>
              <p className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400">
                {t("aboutSignificanceAuthor")}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("aboutSignificanceP2")}
            </p>
          </div>

          {/* Right: Interactive Visual Card */}
          <div className="lg:col-span-5">
            <div className="process-card process-card-hover border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoImg} alt="shrimpAI" className="h-8 w-8 rounded-full object-contain ring-2 ring-cyan-500/20" />
                  <span className="text-sm font-black text-slate-900 dark:text-white">shrimpAI Scanner</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {t("scannerCardActive")}
                </span>
              </div>

              {/* Shrimp Visual Preview Rotating */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-inner select-none">
                {aboutScannerSlides.map((slide, idx) => (
                  <div
                    key={slide.scientificName}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentSlideIndex
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="process-img h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="animated-laser z-20" />
                <div className="ai-corner-tl z-20" />
                <div className="ai-corner-tr z-20" />
                <div className="ai-corner-bl z-20" />
                <div className="ai-corner-br z-20" />

                <div className="absolute bottom-3 inset-x-3 rounded-xl bg-slate-950/85 backdrop-blur-md p-2.5 border border-cyan-500/30 text-white text-xs flex items-center justify-between font-mono z-20">
                  <span className="text-cyan-300">
                    {t("scannerTarget")}: {aboutScannerSlides[currentSlideIndex].name}
                  </span>
                  <span className="text-emerald-400 font-bold">Conf: {aboutScannerSlides[currentSlideIndex].confidence}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <span>{t("modelLabel")}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{t("modelVal")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <span>{t("speedLabel")}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{t("speedVal")}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500 dark:text-slate-400">
                  <span>{t("deviceLabel")}</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{t("deviceVal")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ 4 TRỤ CỘT TÍNH NĂNG CÔNG NGHỆ ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            {t("aboutTechPlatform")}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            {t("aboutPillarsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("aboutPillarsSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="process-card process-card-hover border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-800 shadow-2xs">
                    {p.icon}
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {p.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ TIÊU CHÍ PHÂN LOẠI & ĐÁNH GIÁ ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                {t("aboutCriteriaBadge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t("aboutCriteriaTitle")}
              </h2>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-teal-50 dark:bg-teal-950/60 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800">
              {t("aboutCriteriaTag")}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 p-4 space-y-3 hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${c.badgeColor}`}>
                    {c.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.detail}</p>
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {t("mechanismLabel")}{" "}
                  <span className="text-slate-700 dark:text-slate-300">{c.status}</span>
                </div>
              </div>
            ))}

            {/* Quick Demo Shrimp Card */}
            <div className="rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 dark:from-cyan-950/30 dark:to-teal-950/30 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  {t("critSampleBadge")}
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={shrimpSampleImg}
                    alt={t("the_chan_trang")}
                    className="h-14 w-18 object-cover rounded-xl border border-cyan-200 dark:border-cyan-700 shadow-2xs"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{t("the_chan_trang")}</h5>
                    <p className="text-[11px] italic text-slate-500 dark:text-slate-400">L. vannamei</p>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {t("confidence")}: 96.8%
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnalysisModalOpen(true)}
                className="mt-3 w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
              >
                {t("critSampleBtn")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ HỆ SINH THÁI SẢN PHẨM & ỨNG DỤNG ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            {t("aboutAppsBadge")}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            {t("aboutAppsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("aboutAppsSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((app, idx) => (
            <div
              key={idx}
              className="process-card process-card-hover rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{app.icon}</span>
                <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 text-[10px] font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
                  {app.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ CTA BANNER ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-teal-950 dark:from-slate-950 dark:via-cyan-950/90 dark:to-teal-950/90 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-cyan-900/30">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {t("aboutCtaBadge")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              {t("aboutCtaTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {t("aboutCtaSubtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="btn-cyan-glow shimmer-sweep px-6 py-3.5 text-sm rounded-xl cursor-pointer"
            >
              <span>{t("aboutCtaBtn")}</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition backdrop-blur-xs"
            >
              <span>{t("aboutBackHome")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
      />
    </div>
  );
}
