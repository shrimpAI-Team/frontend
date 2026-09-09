import { useState } from "react";
import { Link } from "react-router-dom";
import { AnalysisModal } from "../components/ui/AnalysisModal";
import logoImg from "../assets/Logo.png";
import shrimpSampleImg from "../assets/shrimp_sample.jpg";
import shrimpHeroScannerImg from "../assets/shrimp_hero_scanner.jpg";

export default function AboutPage() {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // 4 Trụ cột công nghệ cốt lõi
  const pillars = [
    {
      icon: (
        <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: "Computer Vision",
      title: "Xử lý ảnh & Định vị tôm",
      desc: "Tự động phát hiện đối tượng tôm từ ảnh chụp điện thoại, máy tính hoặc camera quan trắc ao. Khử nhiễu bề mặt nước, tách nền và bóc tách từng chi tiết hình thái sinh học.",
      highlights: ["Lọc bóng phản chiếu mặt nước", "Tách viền cá thể tôm chính xác", "Hỗ trợ đa nguồn camera/ảnh chụp"],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: "Deep Learning AI",
      title: "Nhận dạng & Phân loại đa tiêu chí",
      desc: "Áp dụng mô hình học sâu (Deep Neural Networks) để nhận dạng giống tôm (Thẻ chân trắng, tôm Sú, Càng xanh...), phân hạng kích cỡ, phân tích màu sắc và độ bóng khỏe.",
      highlights: ["Độ tin cậy nhận diện >96.8%", "Ước lượng size & trọng lượng", "Phân tích sắc diện vỏ tôm"],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: "Database & History",
      title: "Quản lý Lô & Lịch sử nuôi",
      desc: "Hệ thống hỗ trợ quản lý dữ liệu theo từng ao nuôi, khu vực nuôi hoặc đợt kiểm tra định kỳ. Lưu trữ toàn bộ lịch sử phân tích phục vụ tra cứu, thống kê và so sánh tăng trưởng.",
      highlights: ["Lưu vết lịch sử kiểm định", "Theo dõi biểu đồ tăng trưởng", "Phân nhóm theo ao/khu nuôi"],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      badge: "Intelligent Trigger",
      title: "Cảnh báo bất thường tự động",
      desc: "Kịp thời gửi thông báo cảnh báo khi phát hiện tôm có kích thước không đồng đều (phân đàn), màu sắc bất thường (đốm đen, đục cơ) hoặc tỷ lệ loại không đạt vượt ngưỡng.",
      highlights: ["Cảnh báo tôm phân đàn mạnh", "Phát hiện đốm đen, đục cơ", "Ngưỡng tỷ lệ loại không đạt"],
    },
  ];

  // Tiêu chí đánh giá
  const criteria = [
    {
      name: "Định danh Giống tôm",
      detail: "Xác định chính xác loại tôm (Tôm thẻ chân trắng Litopenaeus vannamei, Tôm sú Penaeus monodon...) qua cấu trúc gai chủy và vân cơ thể.",
      status: "Tự động 100%",
      confidence: "96.8%",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      name: "Phân hạng Kích cỡ",
      detail: "Đo lường kích thước tương quan, ước lượng chiều dài thân và phân chia size tôm thương phẩm theo tiêu chuẩn thị trường.",
      status: "Tự động theo điểm ảnh",
      confidence: "95.2%",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      name: "Màu sắc & Thể trạng",
      detail: "Kiểm tra màu sắc vỏ tôm, độ trong suốt cơ thịt, phát hiện các hiện tượng sắc tố bất thường như đỏ thân, đốm đen sẹo vỏ.",
      status: "Phân tích RGB/HSV",
      confidence: "94.5%",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Độ đồng đều đàn tôm",
      detail: "Tính toán hệ số phân tán kích thước (CV%) trong cùng một mẻ chụp mẫu, phát hiện sớm tình trạng phân đàn trong ao nuôi.",
      status: "Đánh giá mẫu đa điểm",
      confidence: "Độ nhạy cao",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      name: "Tỷ lệ chuẩn thương phẩm",
      detail: "Tổng hợp tỷ lệ tôm Loại 1, Loại 2 và loại dạt; tự động kích hoạt cảnh báo nếu tỷ lệ không đạt vượt quá giới hạn thiết lập.",
      status: "Cảnh báo theo ngưỡng",
      confidence: "Báo cáo tức thì",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  // Đối tượng ứng dụng
  const applications = [
    {
      title: "Trang trại nuôi tôm thương phẩm",
      desc: "Kiểm tra kích cỡ tôm định kỳ tại bờ ao bằng điện thoại mà không cần bắt cân thủ công gây stress hay tổn thương tôm, theo dõi sinh trưởng liên tục.",
      icon: "🦐",
      tag: "Giám sát ao nuôi",
    },
    {
      title: "Cơ sở sản xuất tôm giống",
      desc: "Đánh giá nhanh độ đồng đều của đàn postlarvae, sàng lọc tôm giống đạt chuẩn chất lượng cao trước khi xuất bán cho người nuôi.",
      icon: "🧪",
      tag: "Tuyển chọn giống",
    },
    {
      title: "Hợp tác xã thủy sản",
      desc: "Chuẩn hóa dữ liệu chất lượng sản phẩm theo từng lô thu hoạch, minh bạch hóa quy trình nuôi trồng phục vụ truy xuất nguồn gốc.",
      icon: "🤝",
      tag: "Chuẩn hóa chuỗi cung ứng",
    },
    {
      title: "Cơ sở thu mua & Chế biến",
      desc: "Phân loại size tôm tốc độ cao khi thu mua tại đầm hoặc trên băng chuyền, loại bỏ yếu tố cảm tính chủ quan, rút ngắn 80% thời gian kiểm định.",
      icon: "🏢",
      tag: "Kiểm định & Phân loại nhanh",
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* ════════════════════════ HERO HEADER ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/60 via-white to-white p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
          {/* Background Ambient Circles */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/90 px-3.5 py-1.5 text-xs font-black tracking-wide text-cyan-800 shadow-2xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>TỔNG QUAN HỆ THỐNG • shrimpAI VISION PLATFORM</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Hệ thống nhận dạng & phân loại tôm bằng{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                xử lý ảnh và Trí tuệ nhân tạo (AI)
              </span>
            </h1>

            <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
              Giải pháp công nghệ thị giác máy tính hỗ trợ người nuôi tôm, trang trại và cơ sở thu mua nhận diện giống tôm, đo kích thước, đánh giá độ đồng đều và cảnh báo bất thường nhanh chóng qua ảnh chụp từ điện thoại hoặc camera.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAnalysisModalOpen(true)}
                className="btn-cyan-glow shimmer-sweep px-6 py-3 text-sm rounded-xl"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4 4-4 4 4" />
                </svg>
                <span>Trải nghiệm phân tích tôm</span>
              </button>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-xs hover:border-cyan-300 hover:text-cyan-700 hover:shadow-sm transition-all"
              >
                <span>Về Trang chủ</span>
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
              <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
                Ý NGHĨA DỰ ÁN
              </span>
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Hiện đại hóa giám sát thủy sản bằng Công nghệ số
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Trong nuôi tôm truyền thống, việc kiểm tra kích cỡ, đánh giá thể trạng và phân loại tôm thường thực hiện thủ công bằng mắt thường hoặc bắt mẫu cân đo. Phương pháp này không chỉ tốn nhiều công sức mà còn dễ gây trầy xước, sốc cho tôm và phụ thuộc lớn vào cảm quan chủ quan.
            </p>

            <div className="rounded-2xl border-l-4 border-cyan-500 bg-cyan-50/60 p-5 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-cyan-900 leading-relaxed">
                "Đề tài nhằm xây dựng hệ thống phần mềm hỗ trợ nhận dạng và phân loại tôm thông qua hình ảnh chụp từ điện thoại hoặc camera. Sử dụng kỹ thuật xử lý ảnh và AI để nhận diện đối tượng tôm, hỗ trợ phân loại theo loại tôm, kích thước, màu sắc, mức độ đồng đều hoặc một số dấu hiệu bất thường bên ngoài."
              </p>
              <p className="text-[11px] font-bold text-cyan-700">
                — Nghiên cứu & phát triển shrimpAI
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Kết quả phân tích được lưu trữ an toàn vào cơ sở dữ liệu và hiển thị trực quan trên giao diện Web App / Mobile App, giúp người quản lý ao dễ dàng theo dõi, thống kê và đưa ra quyết định kịp thời cho từng đợt thu hoạch.
            </p>
          </div>

          {/* Right: Interactive Visual Card */}
          <div className="lg:col-span-5">
            <div className="process-card process-card-hover border border-slate-200/90 bg-white p-6 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoImg} alt="shrimpAI" className="h-8 w-8 rounded-full object-contain ring-2 ring-cyan-500/20" />
                  <span className="text-sm font-black text-slate-900">shrimpAI Scanner</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Hoạt động
                </span>
              </div>

              {/* Shrimp Visual Preview */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-inner">
                <img
                  src={shrimpHeroScannerImg}
                  alt="Mô hình phân tích tôm AI"
                  className="process-img h-full w-full object-cover"
                />
                <div className="animated-laser" />
                <div className="ai-corner-tl" />
                <div className="ai-corner-tr" />
                <div className="ai-corner-bl" />
                <div className="ai-corner-br" />

                <div className="absolute bottom-3 inset-x-3 rounded-xl bg-slate-950/85 backdrop-blur-md p-2.5 border border-cyan-500/30 text-white text-xs flex items-center justify-between font-mono">
                  <span className="text-cyan-300">Target: Penaeus vannamei</span>
                  <span className="text-emerald-400 font-bold">Conf: 96.8%</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-500">
                  <span>Mô hình phân tích:</span>
                  <span className="font-bold text-slate-800">YOLOv8 + ResNet Classifier</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-500">
                  <span>Tốc độ xử lý:</span>
                  <span className="font-bold text-slate-800">0.24 giây / mẫu</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500">
                  <span>Thiết bị hỗ trợ:</span>
                  <span className="font-bold text-cyan-600">Smartphone, PC, Camera IP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ 4 TRỤ CỘT TÍNH NĂNG CÔNG NGHỆ ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
            NỀN TẢNG CÔNG NGHỆ
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            4 Trụ cột tính năng cốt lõi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kết hợp sức mạnh giữa thuật toán xử lý ảnh số và mạng nơ-ron học sâu để chuẩn hóa quy trình phân tích tôm.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="process-card process-card-hover border border-slate-200/80 bg-white rounded-3xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 border border-cyan-100 shadow-2xs">
                    {p.icon}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {p.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                    <span className="text-cyan-600 font-bold">✓</span>
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
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
                TIÊU CHÍ ĐÁNH GIÁ THỰC TẾ
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Các chỉ tiêu nhận dạng & phân loại tôm
              </h2>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 border border-teal-100">
              Định chuẩn theo thực tế thị trường
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3 hover:bg-white hover:border-cyan-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${c.badgeColor}`}>
                    {c.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.detail}</p>
                <div className="text-[11px] font-semibold text-slate-400">
                  Cơ chế: <span className="text-slate-700">{c.status}</span>
                </div>
              </div>
            ))}

            {/* Quick Demo Shrimp Card */}
            <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700">
                  MẪU THỬ NGHIỆM ĐIỂN HÌNH
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={shrimpSampleImg}
                    alt="Mẫu tôm thẻ"
                    className="h-14 w-18 object-cover rounded-xl border border-cyan-200 shadow-2xs"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Tôm thẻ chân trắng</h5>
                    <p className="text-[11px] italic text-slate-500">L. vannamei</p>
                    <span className="text-[10px] font-bold text-emerald-600">Độ tin cậy: 96.8%</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnalysisModalOpen(true)}
                className="mt-3 w-full rounded-xl bg-cyan-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-500 transition cursor-pointer"
              >
                Kiểm tra thử ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ HỆ SINH THÁI SẢN PHẨM & ỨNG DỤNG ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black tracking-wider uppercase text-cyan-600">
            HỆ THỐNG TRIỂN KHAI THỰC TẾ
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Khả năng ứng dụng & Đối tượng sử dụng
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sản phẩm dự kiến gồm Web App quản trị trung tâm, Mobile App di động và Trạm camera kiểm định tốc độ cao.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((app, idx) => (
            <div
              key={idx}
              className="process-card process-card-hover rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{app.icon}</span>
                <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-700 border border-cyan-100">
                  {app.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">{app.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{app.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ CTA BANNER ════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-teal-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Sẵn sàng thử nghiệm
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Bắt đầu kiểm định hình ảnh tôm cùng shrimpAI
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Tải ảnh lên hoặc chụp ảnh trực tiếp để hệ thống AI phân tích kích thước, nhận diện giống loài và trả báo cáo chi tiết.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="btn-cyan-glow shimmer-sweep px-6 py-3.5 text-sm rounded-xl"
            >
              <span>Phân tích tôm ngay</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition backdrop-blur-xs"
            >
              <span>Về Trang Chủ</span>
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
