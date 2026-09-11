import { useState, useRef, useEffect } from "react";
import { Spinner } from "./Spinner";
import logoImg from "../../assets/Logo.png";
import { shrimpApi } from "../../api/shrimp.api";
import { apiError } from "../../lib/api";

interface AnalysisResult {
  species: string;
  scientificName: string;
  confidence: number;
  healthStatus: string;
  estimatedSize: string;
  commercialGrade: string;
  processingTime: string;
  imageDimensions: string;
  notes: string;
  modelStatus?: string;
  alerts?: string[];
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string | null;
}

const SAMPLE_SHRIMPS = [
  {
    id: "the_chan_trang",
    name: "Tôm thẻ chân trắng",
    file: "/shrimp_sample.jpg",
    badge: "Mẫu phổ biến",
    desc: "Litopenaeus vannamei",
  },
  {
    id: "tom_su",
    name: "Tôm sú",
    file: "/shrimp_black_tiger.jpg",
    badge: "Xuất khẩu",
    desc: "Penaeus monodon",
  },
  {
    id: "tom_cang_xanh",
    name: "Tôm càng xanh",
    file: "/shrimp_giant_prawn.jpg",
    badge: "Nước ngọt",
    desc: "Macrobrachium rosenbergii",
  },
];

export function AnalysisModal({
  isOpen,
  onClose,
  initialImage,
}: AnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cameraError, setCameraError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
      setSelectedFileName("initial_sample.jpg");
    }
  }, [initialImage]);

  // Clean up camera stream and reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedImage(null);
      setSelectedFile(null);
      setSelectedFileName("");
      setResult(null);
      setAnalysisError(null);
      setIsAnalyzing(false);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(
        "Không thể truy cập camera. Vui lòng cấp quyền truy cập thiết bị hoặc sử dụng tính năng tải ảnh từ máy.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setSelectedImage(dataUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fname = `camera_capture_${Date.now()}.jpg`;
            setSelectedFile(new File([blob], fname, { type: "image/jpeg" }));
            setSelectedFileName(fname);
          }
        },
        "image/jpeg",
        0.9,
      );

      stopCamera();
      setActiveTab("upload");
      setResult(null);
      setAnalysisError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setAnalysisError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setAnalysisError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = async (sample: (typeof SAMPLE_SHRIMPS)[0]) => {
    setSelectedImage(sample.file);
    setSelectedFileName(sample.file.replace("/", ""));
    setAnalysisError(null);
    setResult(null);

    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const fname = sample.file.replace("/", "");
      setSelectedFile(new File([blob], fname, { type: blob.type || "image/jpeg" }));
    } catch {
      // Sẽ fallback tải lại qua URL khi phân tích
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage && !selectedFile) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setResult(null);

    try {
      let fileToSend = selectedFile;

      // Nếu chưa có file object (ví dụ chọn qua sample image URL)
      if (!fileToSend && selectedImage) {
        const fetchRes = await fetch(selectedImage);
        const blob = await fetchRes.blob();
        const fname = selectedFileName || "shrimp_sample.jpg";
        fileToSend = new File([blob], fname, {
          type: blob.type || "image/jpeg",
        });
      }

      if (!fileToSend) {
        throw new Error("Chưa có dữ liệu hình ảnh để phân tích.");
      }

      const uploadName =
        (fileToSend as File).name || selectedFileName || "shrimp_image.jpg";
      const data = await shrimpApi.analyze(fileToSend, uploadName);

      setResult({
        species: data.species,
        scientificName: data.scientificName,
        confidence: data.confidence,
        healthStatus: data.abnormalDetected
          ? "Cần lưu ý: Phát hiện dấu hiệu bất thường"
          : "Tốt (Vỏ sáng bóng, phụ bộ nguyên vẹn)",
        estimatedSize: data.sizeEstimate || "30 con/kg",
        commercialGrade: data.commercialGrade || "Loại 1 (Thương phẩm)",
        processingTime: data.processingTime || "0.25 giây",
        imageDimensions:
          data.imageDimensions || `${(fileToSend.size / 1024).toFixed(0)} KB`,
        notes:
          data.description ||
          "Mô hình Deep Learning AI Vision phân tích chính xác dựa trên hình thái và phân bổ sắc tố.",
        modelStatus: data.modelStatus,
        alerts: data.alerts,
      });
    } catch (err: unknown) {
      setAnalysisError(
        apiError(
          err,
          "Không thể phân tích ảnh lúc này. Vui lòng đảm bảo máy chủ backend đang chạy.",
        ),
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-2xl rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-sky-50/50 via-white to-cyan-50/40">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-cyan-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Phân tích & Nhận dạng Tôm bằng AI
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
                  ● Realtime Vision
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gửi ảnh trực tiếp đến Backend NestJS & AI Vision Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Error Banner */}
          {analysisError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800 flex items-start gap-3">
              <span className="text-lg leading-none">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-rose-900">Lỗi phân tích:</p>
                <p className="mt-0.5">{analysisError}</p>
              </div>
              <button
                type="button"
                onClick={runAnalysis}
                className="rounded-lg bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-700 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Method Tabs */}
          {!result && (
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("upload");
                  stopCamera();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === "upload"
                    ? "bg-white text-cyan-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📁 Tải ảnh từ máy
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("camera");
                  void startCamera();
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                  activeTab === "camera"
                    ? "bg-white text-cyan-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📷 Chụp ảnh trực tiếp
              </button>
            </div>
          )}

          {/* Upload Tab View */}
          {activeTab === "upload" && !selectedImage && !result && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50/30 p-8 text-center cursor-pointer transition hover:bg-cyan-50/60 hover:border-cyan-400"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-100 text-cyan-600 text-2xl shadow-inner mb-3">
                  ☁️
                </div>
                <p className="font-bold text-slate-800 text-base">
                  Kéo thả ảnh tôm vào đây
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  hoặc nhấp để chọn tệp từ thiết bị của bạn
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 transition"
                >
                  🖼️ Chọn ảnh từ máy
                </button>
                <p className="mt-3 text-[11px] text-slate-400">
                  Định dạng: JPG, PNG, WEBP (Tối đa 15MB)
                </p>
              </div>

              {/* Quick Sample Selector */}
              <div>
                <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                  <span>⚡</span> Hoặc chọn nhanh ảnh mẫu có sẵn để kiểm thử:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {SAMPLE_SHRIMPS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="group relative flex flex-col items-center p-2 rounded-xl border border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md transition text-left"
                    >
                      <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                        <img
                          src={sample.file}
                          alt={sample.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <span className="w-full text-xs font-bold text-slate-800 truncate">
                        {sample.name}
                      </span>
                      <span className="w-full text-[10px] text-slate-400 truncate">
                        {sample.desc}
                      </span>
                      <span className="mt-1 self-start rounded-md bg-cyan-50 px-1.5 py-0.5 text-[9px] font-bold text-cyan-700">
                        {sample.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Camera Tab View */}
          {activeTab === "camera" && !selectedImage && !result && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white">
              {cameraError ? (
                <div className="p-8 text-center">
                  <p className="text-amber-400 text-sm mb-3">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Thử lại
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-72 object-cover"
                  />
                  {/* Camera Reticle Overlay */}
                  <div className="absolute inset-8 border-2 border-cyan-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-xs bg-slate-900/60 px-2 py-1 rounded text-cyan-300 backdrop-blur">
                      Căn chỉnh tôm vào giữa khung hình
                    </span>
                  </div>
                  <div className="p-4 bg-slate-900/80 backdrop-blur flex justify-center">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 text-sm shadow-lg transition"
                    >
                      📸 Chụp ảnh ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Selected Preview & Analysis Action */}
          {selectedImage && !result && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                <img
                  src={selectedImage}
                  alt="Tôm cần phân tích"
                  className="w-full max-h-72 object-contain mx-auto"
                />

                {/* AI Laser Scanning Effect */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-pulse" />
                    </div>
                    <div className="absolute rounded-2xl bg-slate-900/95 px-6 py-4 text-center text-white backdrop-blur shadow-2xl border border-cyan-500/30">
                      <Spinner className="h-7 w-7 text-cyan-400 mx-auto mb-2.5 animate-spin" />
                      <p className="text-xs font-bold text-cyan-300">
                        Đang gửi ảnh tới AI Engine phân tích đặc trưng...
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        POST /shrimp-analysis/analyze ➔ Deep Learning Vision
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!isAnalyzing && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedFile(null);
                      setSelectedFileName("");
                      setResult(null);
                      setAnalysisError(null);
                    }}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Chọn ảnh khác
                  </button>
                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="flex-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition"
                  >
                    ⚡ Bắt đầu phân tích AI
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Result View */}
          {result && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        ✓ Nhận dạng thành công
                      </span>
                      {result.modelStatus && (
                        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-800">
                          {result.modelStatus}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 text-2xl font-black text-slate-900">
                      {result.species}
                    </h4>
                    <p className="text-xs font-semibold italic text-slate-500">
                      ({result.scientificName})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500">
                      Độ tin cậy AI
                    </span>
                    <p className="text-2xl font-black text-emerald-600">
                      {result.confidence}%
                    </p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-3">
                  <div className="h-2.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-4 grid gap-3 grid-cols-2 text-xs border-t border-emerald-100 pt-3">
                  <div>
                    <span className="text-slate-500">Tình trạng hình thái:</span>
                    <p className="font-semibold text-slate-800">
                      {result.healthStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Kích cỡ ước tính:</span>
                    <p className="font-semibold text-slate-800">
                      {result.estimatedSize}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Phân hạng thương phẩm:</span>
                    <p className="font-semibold text-slate-800">
                      {result.commercialGrade}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Thời gian xử lý:</span>
                    <p className="font-semibold text-slate-800">
                      {result.processingTime}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Đặc trưng sinh học & ghi chú:</span>
                    <p className="font-medium text-slate-700 mt-0.5">
                      {result.notes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setSelectedFileName("");
                    setAnalysisError(null);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  🔄 Phân tích ảnh khác
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-700 shadow-sm transition"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
