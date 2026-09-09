import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import shrimpHeroScannerImg from "../assets/shrimp_hero_scanner.jpg";
import shrimpSampleImg from "../assets/shrimp_sample.jpg";
import shrimpBlackTigerImg from "../assets/shrimp_black_tiger.jpg";
import shrimpGiantPrawnImg from "../assets/shrimp_giant_prawn.jpg";
import logoImg from "../assets/Logo.png";

interface OutletContextType {
  openAnalysisModal: () => void;
}

const heroShrimpSlides = [
  {
    id: "vannamei",
    name: "Tôm thẻ chân trắng",
    scientificName: "Litopenaeus vannamei",
    confidence: "96.8%",
    statusBadge: "Đã nhận dạng",
    specimenBadge: "Giống nuôi chủ lực",
    size: "Size: 30 con/kg • Đạt chuẩn",
    image: shrimpHeroScannerImg,
    thumb: shrimpSampleImg,
    icon: "🦐",
  },
  {
    id: "monodon",
    name: "Tôm sú",
    scientificName: "Penaeus monodon",
    confidence: "98.4%",
    statusBadge: "Đã nhận dạng",
    specimenBadge: "Tôm xuất khẩu giá trị cao",
    size: "Size: 15 con/kg • Vân vằn rõ",
    image: shrimpBlackTigerImg,
    thumb: shrimpBlackTigerImg,
    icon: "🐅",
  },
  {
    id: "rosenbergii",
    name: "Tôm càng xanh",
    scientificName: "Macrobrachium rosenbergii",
    confidence: "97.5%",
    statusBadge: "Đã nhận dạng",
    specimenBadge: "Đặc sản nước ngọt",
    size: "Size: 10 con/kg • Càng xanh bóng",
    image: shrimpGiantPrawnImg,
    thumb: shrimpGiantPrawnImg,
    icon: "🦞",
  },
];

export default function DashboardPage() {
  const { openAnalysisModal } = useOutletContext<OutletContextType>();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate slides every 4 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroShrimpSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = heroShrimpSlides[currentSlideIndex];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ════════════════════════ HERO SECTION ════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-cyan-50/70 via-sky-50/40 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100/80 px-3.5 py-1.5 text-xs font-bold text-cyan-800 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                AI • Xử lý ảnh • Thủy sản
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
                Nhận dạng và <br />
                phân loại tôm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600">
                  bằng AI
                </span>
              </h1>

              {/* Description */}
              <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-xl">
                Chỉ cần tải lên hình ảnh tôm, hệ thống của chúng tôi sẽ sử dụng
                công nghệ xử lý ảnh và học sâu (Deep Learning) để nhận dạng và
                phân loại chính xác giống tôm.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={openAnalysisModal}
                  className="btn-cyan-glow shimmer-sweep px-7 py-3.5 text-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-none stroke-current stroke-2"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4 4-4 4 4" />
                  </svg>
                  <span>Phân tích ngay</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("steps")}
                  className="btn-outline-modern"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-none stroke-current stroke-2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Xem cách hoạt động</span>
                </button>
              </div>
            </div>

            {/* Right Visual: AI Vision Scanner Rotating Card */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Glowing Ambient Glow */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 opacity-20 blur-xl" />

                {/* Main Card with Hover Lift */}
                <div
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur card-hover-lift group"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] select-none">
                    {/* Rotating Shrimp Slide Images */}
                    {heroShrimpSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          idx === currentSlideIndex
                            ? "opacity-100 scale-100 z-10"
                            : "opacity-0 scale-105 pointer-events-none z-0"
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}

                    {/* Scanner Target Corners Reticle */}
                    <div className="absolute inset-6 border-2 border-cyan-400/40 rounded-xl pointer-events-none z-20">
                      {/* Top-Left */}
                      <span className="absolute -top-1 -left-1 h-5 w-5 border-t-3 border-l-3 border-cyan-400" />
                      {/* Top-Right */}
                      <span className="absolute -top-1 -right-1 h-5 w-5 border-t-3 border-r-3 border-cyan-400" />
                      {/* Bottom-Left */}
                      <span className="absolute -bottom-1 -left-1 h-5 w-5 border-b-3 border-l-3 border-cyan-400" />
                      {/* Bottom-Right */}
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 border-b-3 border-r-3 border-cyan-400" />
                    </div>

                    {/* Animated Scanning Laser Line */}
                    <div className="animated-laser z-20" />

                    {/* Telemetry Footer Overlay on Image */}
                    <div className="absolute bottom-3 inset-x-3 rounded-xl bg-slate-950/85 backdrop-blur-md px-3.5 py-2 border border-cyan-500/30 text-white text-xs flex items-center justify-between font-mono z-20">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-300 font-bold">{currentSlide.scientificName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{currentSlide.size}</span>
                        <span className="text-cyan-400 font-bold">
                          {currentSlideIndex + 1}/{heroShrimpSlides.length}
                        </span>
                      </div>
                    </div>

                    {/* Prev / Next Arrows */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIndex(
                          (prev) => (prev - 1 + heroShrimpSlides.length) % heroShrimpSlides.length
                        );
                      }}
                      aria-label="Giống tôm trước"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-cyan-600 hover:scale-110 transition shadow-lg cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIndex((prev) => (prev + 1) % heroShrimpSlides.length);
                      }}
                      aria-label="Giống tôm tiếp theo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 grid h-8 w-8 place-items-center rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-cyan-600 hover:scale-110 transition shadow-lg cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>

                  {/* Floating Result Badge at Top-Right (with gentle floating animation) */}
                  <div className="absolute top-6 right-6 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl border border-slate-100 backdrop-blur badge-floating z-30 transition-all duration-300">
                    <img
                      src={currentSlide.thumb}
                      alt={currentSlide.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-500 shrink-0"
                    />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Kết quả nhận dạng
                        </p>
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                          {currentSlide.statusBadge}
                        </span>
                      </div>
                      <p className="text-xs font-black text-slate-900">
                        {currentSlide.name}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600">
                        Độ tin cậy {currentSlide.confidence}
                      </p>
                    </div>
                  </div>

                  {/* Quick Species Indicator Pills underneath card */}
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      {heroShrimpSlides.map((slide, idx) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            idx === currentSlideIndex
                              ? "bg-cyan-600 text-white shadow-sm shadow-cyan-500/30 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <span>{slide.icon}</span>
                          <span className="hidden sm:inline">{slide.name}</span>
                          <span className="sm:hidden">{slide.name.replace("Tôm ", "")}</span>
                        </button>
                      ))}
                    </div>

                    {/* Mini Slide Dots */}
                    <div className="flex items-center gap-1.5">
                      {heroShrimpSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === currentSlideIndex ? "w-6 bg-cyan-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ TRUST / STATS BAR ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
          {/* Stat 1 */}
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-cyan-600 text-2xl">
              ⚙️
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                AI Vision
              </p>
              <p className="text-xs text-slate-500">Công nghệ xử lý ảnh hiện đại</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 text-2xl">
              🎯
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                96.8%
              </p>
              <p className="text-xs text-slate-500">Độ tin cậy</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 text-2xl">
              🖼️
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                Phân tích hình ảnh
              </p>
              <p className="text-xs text-slate-500">Nhanh chóng, chính xác</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 text-2xl">
              ⚡
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                Kết quả tức thì
              </p>
              <p className="text-xs text-slate-500">Tiết kiệm thời gian</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FEATURES SECTION ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
            TÍNH NĂNG NỔI BẬT
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
            Phân tích thông minh từ hình ảnh
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 sm:text-base">
            Ứng dụng công nghệ AI để giúp bạn nhận dạng, phân loại và quản lý
            thông tin về các giống tôm một cách nhanh chóng, chính xác và hiệu quả.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {/* Feature Card 1 */}
          <div className="card-hover-lift p-8 group cursor-pointer">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
              🦐
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition">
              Nhận dạng giống tôm
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Phân biệt chính xác các giống tôm phổ biến như: tôm thẻ chân trắng,
              tôm sú, tôm càng xanh,...
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="card-hover-lift p-8 group cursor-pointer">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-sky-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
              🧠
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition">
              Phân loại bằng AI
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sử dụng mô hình học sâu (Deep Learning) để đạt độ chính xác cao trong
              việc phân loại.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="card-hover-lift p-8 group cursor-pointer">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition duration-300">
              🗄️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition">
              Lưu lịch sử phân tích
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Lưu trữ kết quả và hình ảnh để theo dõi, tra cứu và quản lý dễ dàng.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════ LIVE EXPERIENCE / UPLOAD DEMO ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/50 to-white p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
              TRẢI NGHIỆM NGAY
            </span>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Phân tích tôm chỉ với vài bước
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Tải lên hình ảnh tôm, hệ thống sẽ tự động xử lý và trả về kết quả
              nhận dạng giống tôm cùng độ tin cậy.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left: Interactive Upload Box */}
            <div className="lg:col-span-6">
              <div
                onClick={openAnalysisModal}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-300 bg-white/90 p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 group"
              >
                {/* Shrimp Sample Preview for Upload */}
                <div className="relative mb-4">
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 overflow-hidden rounded-2xl border-2 border-cyan-200/90 bg-slate-50 shadow-md group-hover:scale-105 group-hover:border-cyan-500 group-hover:shadow-cyan-500/25 transition-all duration-300">
                    <img
                      src={shrimpSampleImg}
                      alt="Ảnh mẫu tôm"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent flex items-end justify-center pb-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm group-hover:bg-cyan-500 transition">
                        <svg className="h-3 w-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Tải ảnh
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-base font-bold text-slate-800 group-hover:text-cyan-700 transition">
                  Kéo thả ảnh vào đây
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-4">hoặc</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAnalysisModal();
                  }}
                  className="btn-cyan-glow shimmer-sweep px-5 py-2.5 text-xs font-bold"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-none stroke-current stroke-2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Chọn ảnh từ máy</span>
                </button>

                <p className="mt-4 text-[11px] text-slate-400">
                  Hỗ trợ: JPG, PNG, WEBP | Dung lượng tối đa: 10MB
                </p>
              </div>
            </div>

            {/* Right: Live Sample Analysis Result Card with Hover Lift */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xl card-hover-lift img-container-zoom">
                <div className="grid sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square">
                    <img
                      src={shrimpSampleImg}
                      alt="Tôm thẻ chân trắng"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        Kết quả phân tích
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Đã nhận dạng
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Tôm thẻ chân trắng
                    </h3>
                    <p className="text-xs font-medium italic text-slate-400">
                      (Litopenaeus vannamei)
                    </p>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-600">Độ tin cậy</span>
                        <span className="text-emerald-600">96.8%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                          style={{ width: '96.8%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Thông tin phân tích</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>🦐</span> Loài tôm
                    </div>
                    <div className="font-semibold text-slate-800 text-right">
                      Tôm thẻ chân trắng
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>🎯</span> Độ tin cậy
                    </div>
                    <div className="font-semibold text-slate-800 text-right">
                      96.8%
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>⏱️</span> Thời gian phân tích
                    </div>
                    <div className="font-semibold text-slate-800 text-right">
                      12.4 giây
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>📐</span> Kích thước ảnh
                    </div>
                    <div className="font-semibold text-slate-800 text-right">
                      1024 x 768 px
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-emerald-50/70 p-3 text-[11px] text-emerald-800 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    Kết quả được dựa trên mô hình AI và có thể thay đổi tùy theo chất
                    lượng hình ảnh.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS (3 STEPS) ════════════════════════ */}
      <section id="steps" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-3 text-center">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
            QUY TRÌNH HOẠT ĐỘNG
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Chỉ 3 bước đơn giản
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Hệ thống shrimpAI tự động hoá toàn bộ quy trình từ tải ảnh, xử lý dữ liệu thị giác đến trả kết quả định danh tức thì.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Step 1: Tải ảnh tôm */}
          <div
            onClick={openAnalysisModal}
            className="process-card process-card-hover border border-slate-200/90 bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-cyan-400 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Header: Step badge & Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="step-badge flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white font-black text-sm shadow-md shadow-cyan-500/30">
                  01
                </div>
                <span className="rounded-full bg-cyan-50 text-cyan-700 text-[11px] font-bold px-3 py-1 border border-cyan-100/80">
                  Tải dữ liệu
                </span>
              </div>

              {/* Visual with shrimp_sample.jpg */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group-hover:border-cyan-300 transition-colors">
                <img
                  src={shrimpSampleImg}
                  alt="Tải ảnh tôm"
                  className="process-img h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Upload overlay frame */}
                <div className="absolute inset-3 rounded-xl border-2 border-dashed border-cyan-400/70 pointer-events-none group-hover:border-cyan-400 transition-colors" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm border border-slate-200/60">
                  <svg className="h-3.5 w-3.5 text-cyan-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>JPG • PNG • WEBP</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3 pt-6 text-white flex items-center justify-between">
                  <span className="text-xs font-semibold">Kéo thả hoặc tải từ máy</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    Sẵn sàng
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  1. Tải ảnh tôm
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tải lên ảnh chụp rõ nét tôm thương phẩm hoặc chụp trực tiếp tại bờ ao bằng camera di động.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-cyan-600 group-hover:translate-x-1 transition-transform">
              <span>Trải nghiệm tải ảnh ngay</span>
              <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>

          {/* Step 2: AI phân tích */}
          <div
            onClick={openAnalysisModal}
            className="process-card process-card-hover border border-slate-200/90 bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-teal-400 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Header: Step badge & Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="step-badge flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black text-sm shadow-md shadow-teal-500/30">
                  02
                </div>
                <span className="rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold px-3 py-1 border border-teal-100/80 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                  AI Vision
                </span>
              </div>

              {/* Visual with shrimp_sample.jpg + AI Scanning Laser + Corner Brackets */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/40 shadow-inner">
                <img
                  src={shrimpSampleImg}
                  alt="AI phân tích"
                  className="process-img h-full w-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                {/* AI Laser Scan line */}
                <div className="animated-laser" />

                {/* HUD Corner Targeting Brackets */}
                <div className="ai-corner-tl" />
                <div className="ai-corner-tr" />
                <div className="ai-corner-bl" />
                <div className="ai-corner-br" />

                {/* Center target boundary */}
                <div className="absolute inset-6 rounded-xl border border-cyan-400/50 border-dashed pointer-events-none group-hover:border-cyan-300 transition-colors" />

                {/* AI Telemetry Badge */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-xl bg-slate-950/85 backdrop-blur-md px-3 py-1.5 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Deep Feature Extraction
                  </span>
                  <span className="font-bold text-white">0.24s</span>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  2. AI phân tích
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mô hình AI đa tầng bóc tách cấu trúc vỏ, gai chủy, cuống mắt và phân tích hình thái học độ chính xác cao.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
              <span>Xem mô phỏng quét AI</span>
              <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>

          {/* Step 3: Nhận kết quả */}
          <div
            onClick={openAnalysisModal}
            className="process-card process-card-hover border border-slate-200/90 bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-400 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Header: Step badge & Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="step-badge flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-500/30">
                  03
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 border border-emerald-100/80 flex items-center gap-1">
                  ✓ Độ tin cậy 96.8%
                </span>
              </div>

              {/* Visual with shrimp_sample.jpg + Result Card Overlay */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-emerald-200/80 shadow-sm group-hover:border-emerald-300 transition-colors">
                <img
                  src={shrimpSampleImg}
                  alt="Nhận kết quả"
                  className="process-img h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Verified floating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 shadow-md">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đã nhận dạng
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-3 inset-x-3 rounded-xl bg-white/95 backdrop-blur-md p-2.5 border border-emerald-200/90 shadow-md">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Tôm thẻ chân trắng</span>
                    <span className="text-emerald-600 font-extrabold">96.8%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: '96.8%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  3. Nhận kết quả
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhận kết quả định danh giống tôm, tên khoa học, độ tin cậy và lưu tự động vào lịch sử phân tích.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Xem chi tiết báo cáo</span>
              <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-10 w-10 rounded-full object-contain ring-2 ring-cyan-500/20"
            />
            <div>
              <span className="font-black text-slate-900 text-lg">
                shrimp<span className="text-cyan-600">AI</span>
              </span>
              <p className="text-xs text-slate-500">
                Hệ thống nhận dạng và phân loại tôm bằng xử lý ảnh và AI
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
            <a href="#home" className="hover:text-cyan-600">
              Trang chủ
            </a>
            <button
              type="button"
              onClick={openAnalysisModal}
              className="hover:text-cyan-600 cursor-pointer"
            >
              Phân tích tôm
            </button>
            <a href="#history" className="hover:text-cyan-600">
              Lịch sử
            </a>
            <Link to="/about" className="hover:text-cyan-600">
              Giới thiệu
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400">
            © 2025 shrimpAI Team. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
