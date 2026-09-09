import { useState, useRef, useEffect } from "react";
import { Spinner } from "./Spinner";
import logoImg from "../../assets/Logo.png";

interface AnalysisResult {
  species: string;
  scientificName: string;
  confidence: number;
  healthStatus: string;
  estimatedSize: string;
  processingTime: string;
  imageDimensions: string;
  notes: string;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string | null;
}

export function AnalysisModal({
  isOpen,
  onClose,
  initialImage,
}: AnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cameraError, setCameraError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  // Clean up camera stream when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedImage(null);
      setResult(null);
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
    } catch (err) {
      setCameraError(
        "Không thể truy cập camera. Vui lòng cấp quyền truy cập thiết bị hoặc sử dụng tính năng tải ảnh từ máy."
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
      stopCamera();
      setActiveTab("upload");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulated Deep Learning AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        species: "Tôm thẻ chân trắng",
        scientificName: "Litopenaeus vannamei",
        confidence: 96.8,
        healthStatus: "Tốt (Vỏ sáng, phụ bộ nguyên vẹn)",
        estimatedSize: "14.2 cm",
        processingTime: "0.92 giây",
        imageDimensions: "1024 x 768 px",
        notes: "Mô hình nhận diện với độ tương thích cao. Tôm thẻ chân trắng thương phẩm đạt chuẩn.",
      });
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-sky-50/50 to-white">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-cyan-500/20 shadow-xs"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Phân tích & Nhận dạng Tôm bằng AI
              </h3>
              <p className="text-xs text-slate-500">
                Tải ảnh hoặc chụp ảnh trực tiếp để mô hình nhận diện
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
                Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 10MB)
              </p>
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

          {/* Image Selected Preview & Analysis State */}
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
                  <div className="absolute inset-0 bg-cyan-900/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Laser Bar */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                    </div>
                    <div className="absolute rounded-2xl bg-slate-900/90 px-5 py-3 text-center text-white backdrop-blur shadow-xl">
                      <Spinner className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-cyan-300">
                        Đang trích xuất đặc trưng & phân loại giống tôm...
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Mô hình Deep Learning AI Vision
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
                      setResult(null);
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
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      ✓ Đã nhận dạng thành công
                    </span>
                    <h4 className="mt-2 text-2xl font-black text-slate-900">
                      {result.species}
                    </h4>
                    <p className="text-xs font-medium italic text-slate-500">
                      ({result.scientificName})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500">
                      Độ tin cậy
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
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-4 grid gap-3 grid-cols-2 text-xs border-t border-emerald-100 pt-3">
                  <div>
                    <span className="text-slate-500">Tình trạng:</span>
                    <p className="font-semibold text-slate-800">
                      {result.healthStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Kích thước ước tính:</span>
                    <p className="font-semibold text-slate-800">
                      {result.estimatedSize}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Thời gian AI xử lý:</span>
                    <p className="font-semibold text-slate-800">
                      {result.processingTime}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Độ phân giải:</span>
                    <p className="font-semibold text-slate-800">
                      {result.imageDimensions}
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
                  }}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  🔄 Phân tích ảnh mới
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
