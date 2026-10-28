import { useI18nStore } from "../../store/i18n.store";
import shrimpSampleImg from "../../assets/shrimp_sample.jpg";

export function ShrimpHeroArtwork() {
  const { lang } = useI18nStore();

  const shrimpName =
    lang === "vi"
      ? "Tôm thẻ chân trắng • 98.6%"
      : "Whiteleg Shrimp (L. vannamei) • 98.6%";

  return (
    <div className="relative w-full max-w-[440px] aspect-[16/10] select-none pointer-events-none flex items-center justify-center">
      {/* 1. Ambient Glow & Water Ripples */}
      <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-400/20 via-sky-300/25 to-blue-400/20 blur-2xl" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-300/30 dark:border-cyan-500/20 animate-pulse" />
      <div className="absolute w-[380px] h-[380px] rounded-full border border-cyan-200/20 dark:border-cyan-600/10" />

      {/* 2. Floating Water Bubbles (Underwater Aesthetic) */}
      <div className="absolute top-2 right-12 w-7 h-7 rounded-full bg-gradient-to-tr from-white/40 via-cyan-200/30 to-white/70 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(6,182,212,0.25)] backdrop-blur-xs animate-bounce [animation-duration:5s]" />
      <div className="absolute top-10 left-8 w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-white/40 via-cyan-200/30 to-white/70 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),0_2px_8px_rgba(6,182,212,0.2)] backdrop-blur-xs animate-pulse [animation-duration:3s]" />
      <div className="absolute bottom-6 right-20 w-8 h-8 rounded-full bg-gradient-to-tr from-white/40 via-cyan-200/30 to-white/70 shadow-[inset_0_2px_5px_rgba(255,255,255,0.9),0_6px_16px_rgba(6,182,212,0.25)] backdrop-blur-xs animate-bounce [animation-duration:6s]" />
      <div className="absolute bottom-10 left-14 w-5 h-5 rounded-full bg-gradient-to-tr from-white/40 via-cyan-200/30 to-white/70 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_10px_rgba(6,182,212,0.2)] backdrop-blur-xs animate-pulse [animation-duration:4s]" />

      {/* 3. Main Centerpiece: Shrimp Image Container */}
      <div className="relative z-10 w-[86%] aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_35px_rgba(6,182,212,0.2)] border border-cyan-200/60 dark:border-cyan-500/30 bg-gradient-to-b from-cyan-50/70 to-sky-100/60 dark:from-slate-900/80 dark:to-cyan-950/80 backdrop-blur-sm">
        <img
          src={shrimpSampleImg}
          alt={shrimpName}
          className="w-full h-full object-cover object-center mix-blend-multiply dark:mix-blend-luminosity scale-105"
        />

        {/* Caustic light overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-white/30 dark:from-cyan-950/40 dark:to-cyan-400/10 pointer-events-none" />

        {/* 4. AI Viewfinder Brackets (Target HUD) */}
        <div className="absolute inset-3 sm:inset-5 pointer-events-none">
          {/* Top-Left Bracket */}
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-7 sm:h-7 border-t-3 border-l-3 border-[#00d2ff] rounded-tl-lg shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
          {/* Top-Right Bracket */}
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-7 sm:h-7 border-t-3 border-r-3 border-[#00d2ff] rounded-tr-lg shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
          {/* Bottom-Left Bracket */}
          <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-7 sm:h-7 border-b-3 border-l-3 border-[#00d2ff] rounded-bl-lg shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
          {/* Bottom-Right Bracket */}
          <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 border-b-3 border-r-3 border-[#00d2ff] rounded-br-lg shadow-[0_0_10px_rgba(0,210,255,0.8)]" />

          {/* Scanner laser bar animation */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent shadow-[0_0_12px_#00d2ff] animate-[laserScan_3.5s_easeInOut_infinite]" />

          {/* Center Target Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#00d2ff]/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
          </div>
        </div>

        {/* Specimen Tag (Bilingual: Tiếng Việt / English) */}
        <div className="absolute bottom-2.5 left-2.5 sm:left-3 bg-slate-900/85 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-cyan-400/50 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] sm:text-xs font-bold text-cyan-200 tracking-wide uppercase">
            {shrimpName}
          </span>
        </div>
      </div>

      {/* 5. Glowing AI Circuit Chip Badge (Right Side) */}
      <div className="absolute right-1 sm:-right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center animate-pulse [animation-duration:4s]">
        <div className="relative bg-gradient-to-br from-[#00d2ff] to-[#008fc2] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(0,210,255,0.6)] border border-white/60">
          {/* Circuit Pins */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00d2ff] rounded-t-xs" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#008fc2] rounded-b-xs" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1.5 h-1.5 bg-[#00d2ff] rounded-l-xs" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-1.5 bg-[#008fc2] rounded-r-xs" />

          {/* Chip Center */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-900/90 flex flex-col items-center justify-center text-white font-black text-xs sm:text-sm tracking-tighter">
            <span className="text-[#00d2ff] leading-none">AI</span>
            <span className="text-[6.5px] sm:text-[7.5px] text-cyan-300 font-mono tracking-wider leading-none mt-0.5 uppercase">
              {lang === "vi" ? "QUÉT AI" : "VISION"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
