import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  shrimpApi,
  type ShrimpHistoryItem,
  type ShrimpHistoryStats,
} from "../api/shrimp.api";
import { useI18nStore } from "../store/i18n.store";
import { apiError } from "../lib/api";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import shrimpSampleImg from "../assets/shrimp_sample.jpg";

interface OutletContextType {
  openAnalysisModal: () => void;
}

export default function HistoryPage() {
  const { openAnalysisModal } = useOutletContext<OutletContextType>();
  const { t, lang } = useI18nStore();
  const navigate = useNavigate();

  const [items, setItems] = useState<ShrimpHistoryItem[]>([]);
  const [stats, setStats] = useState<ShrimpHistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Detail Modal & Action States
  const [selectedItem, setSelectedItem] = useState<ShrimpHistoryItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load history data
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shrimpApi.getHistory({
        page,
        limit: 12,
        species: speciesFilter,
        status: statusFilter,
        search: debouncedSearch,
      });

      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
      setStats(res.stats);
    } catch (err: unknown) {
      setError(apiError(err, "Không thể tải danh sách lịch sử giám định."));
    } finally {
      setLoading(false);
    }
  }, [page, speciesFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Listen to new analysis events from AnalysisModal
  useEffect(() => {
    const handleNewAnalysis = () => {
      loadHistory();
      setSuccessMsg("Đã tự động lưu kết quả giám định mới vào lịch sử!");
      setTimeout(() => setSuccessMsg(null), 4000);
    };

    window.addEventListener("shrimp:analyzed", handleNewAnalysis);
    return () => {
      window.removeEventListener("shrimp:analyzed", handleNewAnalysis);
    };
  }, [loadHistory]);

  // Delete single item
  const handleDeleteItem = async (id: string) => {
    setIsDeleting(true);
    try {
      await shrimpApi.deleteHistory(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      setDeleteTargetId(null);
      setSuccessMsg("Đã xóa bản ghi giám định thành công.");
      setTimeout(() => setSuccessMsg(null), 3500);
      loadHistory();
    } catch (err) {
      setError(apiError(err, "Không thể xóa bản ghi lúc này."));
    } finally {
      setIsDeleting(false);
    }
  };

  // Clear all history
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await shrimpApi.clearAllHistory();
      setItems([]);
      setShowClearConfirm(false);
      setSelectedItem(null);
      setSuccessMsg("Đã xóa toàn bộ lịch sử giám định.");
      setTimeout(() => setSuccessMsg(null), 3500);
      loadHistory();
    } catch (err) {
      setError(apiError(err, "Không thể làm trống lịch sử lúc này."));
    } finally {
      setIsClearing(false);
    }
  };

  // Export history to JSON or CSV
  const handleExportData = () => {
    if (!items.length) return;
    const exportData = items.map((item) => ({
      ID: item.id,
      "Tên file": item.originalName || "shrimp.jpg",
      "Giống loài": item.species,
      "Tên khoa học": item.scientificName,
      "Độ tin cậy (%)": item.confidence,
      "Kích thước ước tính": item.sizeEstimate || "",
      "Phân hạng": item.commercialGrade || "",
      "Tình trạng": item.abnormalDetected ? "Cần lưu ý" : "Khỏe mạnh",
      "Thời gian phân tích": item.processingTime || "",
      "Ngày giám định": new Date(item.createdAt).toLocaleString("vi-VN"),
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shrimpAI_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Consult AI regarding this specific specimen
  const handleConsultAi = (item: ShrimpHistoryItem) => {
    navigate("/chat", {
      state: {
        initialQuery: `Tôi vừa giám định mẫu tôm giống ${item.species} (${item.scientificName}) với độ tin cậy ${item.confidence}%, kích thước ${item.sizeEstimate || "tiêu chuẩn"}, tình trạng: ${item.abnormalDetected ? "Cần lưu ý bất thường" : "Khỏe mạnh"}. Xin chuyên gia tư vấn chế độ chăm sóc và quản lý nước phù hợp cho đàn tôm này.`,
      },
    });
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* ════════════════════════ HEADER & ACTIONS ════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100/80 dark:bg-cyan-900/60 px-3 py-1 text-xs font-bold text-cyan-800 dark:text-cyan-300 backdrop-blur mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>● {t("history")} Vision AI</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("historyPageTitle")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t("historyPageSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title={t("exportData")}
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{t("exportData")}</span>
            </button>
          )}

          <button
            type="button"
            onClick={openAnalysisModal}
            className="btn-cyan-glow shimmer-sweep px-5 py-2.5 text-xs font-bold"
          >
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>{t("startAnalysis")}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* ════════════════════════ STATS COUNTERS ════════════════════════ */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total scans */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t("totalScans")}</span>
              <span className="text-lg">🦐</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {t("heroBadge")}
            </p>
          </div>

          {/* Average confidence */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t("avgConfidence")}</span>
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {stats.avgConfidence > 0 ? `${stats.avgConfidence}%` : "--"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {t("accuracyTop")}
            </p>
          </div>

          {/* Healthy */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t("healthySamples")}</span>
              <span className="text-lg">🛡️</span>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.healthyCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.totalCount > 0
                ? `${Math.round((stats.healthyCount / stats.totalCount) * 100)}% tổng số mẫu`
                : "0%"}
            </p>
          </div>

          {/* Warnings */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
              <span>{t("warningSamples")}</span>
              <span className="text-lg">⚠️</span>
            </div>
            <p className="text-2xl font-black text-amber-500 dark:text-amber-400">
              {stats.warningCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Cần kiểm tra chất lượng nước
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════ FILTERS & SEARCH BAR ════════════════════════ */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchHistoryPlaceholder")}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Species */}
          <select
            value={speciesFilter}
            onChange={(e) => {
              setSpeciesFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">{t("filterAllSpecies")}</option>
            <option value="thẻ chân trắng">{t("the_chan_trang")}</option>
            <option value="sú">{t("tom_su")}</option>
            <option value="càng xanh">{t("tom_cang_xanh")}</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">{t("filterAllStatus")}</option>
            <option value="healthy">✓ {t("filterHealthy")}</option>
            <option value="warning">⚠️ {t("filterWarning")}</option>
          </select>

          {/* View Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
              title={t("gridView")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
              title={t("tableView")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4h18v4H3V4zm0 6h18v4H3v-4zm0 6h18v4H3v-4z" />
              </svg>
            </button>
          </div>

          {/* Clear all */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
              title={t("clearAllHistoryBtn")}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════ CONTENT PRESENTATION ════════════════════════ */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-cyan-600 mb-3" />
          <p className="text-xs text-slate-400">Đang tải lịch sử giám định...</p>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 text-3xl mx-auto">
            🦐
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("emptyHistoryTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {t("emptyHistoryDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={openAnalysisModal}
            className="btn-cyan-glow shimmer-sweep px-6 py-3 text-xs font-bold inline-flex items-center gap-2"
          >
            <span>{t("startFirstScan")}</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Card View */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs card-hover-lift cursor-pointer transition-all duration-300 hover:border-cyan-400 dark:hover:border-cyan-500"
            >
              <div>
                {/* Image Container with Zoom and Badges */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] select-none">
                  <img
                    src={item.imageUrl || shrimpSampleImg}
                    alt={item.species}
                    onError={(e) => {
                      // Fallback to static sample if upload file missing
                      (e.target as HTMLImageElement).src = shrimpSampleImg;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top-Right Confidence Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{item.confidence}%</span>
                  </div>

                  {/* Top-Left Health Status Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {item.abnormalDetected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                        ⚠️ Cần lưu ý
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                        ✓ Khỏe mạnh
                      </span>
                    )}
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="absolute bottom-2 inset-x-2 rounded-xl bg-slate-950/85 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[11px] text-white flex items-center justify-between font-mono">
                    <span className="text-cyan-300 truncate max-w-[140px]">
                      {item.sizeEstimate?.split(" (")[0] || "Size tiêu chuẩn"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.processingTime || "0.25s"}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.species}
                    </h3>
                  </div>
                  <p className="text-xs italic font-mono text-cyan-600 dark:text-cyan-400">
                    {item.scientificName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {item.healthStatus || item.description || "Mẫu đạt tiêu chuẩn thương phẩm."}
                  </p>
                </div>
              </div>

              {/* Card Footer: Timestamp & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{formatDate(item.createdAt)}</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleConsultAi(item)}
                    className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition"
                    title={t("consultAiBtn")}
                  >
                    💬
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title={t("deleteBtn")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="px-5 py-3.5">{t("sampleImage")}</th>
                <th className="px-5 py-3.5">{t("speciesCol")}</th>
                <th className="px-5 py-3.5">{t("confidenceCol")}</th>
                <th className="px-5 py-3.5">Kích thước</th>
                <th className="px-5 py-3.5">{t("statusCol")}</th>
                <th className="px-5 py-3.5">{t("scanDate")}</th>
                <th className="px-5 py-3.5 text-right">{t("actionsCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3">
                    <img
                      src={item.imageUrl || shrimpSampleImg}
                      alt={item.species}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = shrimpSampleImg;
                      }}
                      className="h-11 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-slate-900 dark:text-white">{item.species}</p>
                    <p className="text-[11px] italic font-mono text-cyan-600 dark:text-cyan-400">
                      {item.scientificName}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span>{item.sizeEstimate?.split(" (")[0] || "--"}</span>
                  </td>
                  <td className="px-5 py-3">
                    {item.abnormalDetected ? (
                      <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        ⚠️ Cần lưu ý
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        ✓ Khỏe mạnh
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(item.createdAt)}</td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title={t("viewDetail")}
                      >
                        👁️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConsultAi(item)}
                        className="rounded-lg p-1.5 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition"
                        title={t("consultAiBtn")}
                      >
                        💬
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(item.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title={t("deleteBtn")}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ════════════════════════ PAGINATION ════════════════════════ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hiển thị trang {page} / {totalPages} (Tổng số {totalCount} mẫu)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 transition"
            >
              ← Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 transition"
            >
              Sau →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════ DETAIL MODAL ════════════════════════ */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative flex flex-col max-h-[92vh] w-full max-w-3xl rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-2xl overflow-hidden transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-sky-50/50 via-white to-cyan-50/40 dark:from-slate-900 dark:via-[#090d16] dark:to-slate-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦐</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedItem.species}
                  </h3>
                  <p className="text-xs italic font-mono text-cyan-600 dark:text-cyan-400">
                    {selectedItem.scientificName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Photo & High-level Metrics */}
              <div className="grid sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-square shadow-inner">
                  <img
                    src={selectedItem.imageUrl || shrimpSampleImg}
                    alt={selectedItem.species}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = shrimpSampleImg;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Tệp: {selectedItem.originalName || "shrimp.jpg"}
                    </span>
                    {selectedItem.abnormalDetected ? (
                      <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                        ⚠️ Cần lưu ý
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        ✓ Khỏe mạnh hoàn toàn
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Độ tin cậy AI:</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
                        {selectedItem.confidence}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                        style={{ width: `${selectedItem.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-slate-400">Kích thước</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedItem.sizeEstimate || "30 - 40 con/kg"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Phân hạng</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedItem.commercialGrade || "Loại 1 (Thương phẩm)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Thời gian xử lý</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedItem.processingTime || "0.25 giây"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Thời điểm giám định</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {formatDate(selectedItem.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathology & Morphometrics Sections */}
              <div className="space-y-4">
                {/* Health Summary Box */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>🔬</span> {t("pathologyScreening")}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {selectedItem.healthStatus || "Tôm khỏe mạnh, không phát hiện vết hoại tử hoặc đốm trắng bất thường."}
                  </p>
                  {selectedItem.abnormalities?.details && (
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                      {selectedItem.abnormalities.details.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Color Profile */}
                {selectedItem.colorAnalysis && (
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span>🎨</span> {t("colorProfile")}
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold">Màu sắc chủ đạo:</span> {selectedItem.colorAnalysis.dominantColor}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold">Độ trong suốt vỏ:</span> {selectedItem.colorAnalysis.shellTransparency}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setDeleteTargetId(selectedItem.id)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                Xóa mẫu này
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConsultAi(selectedItem)}
                  className="btn-cyan-glow shimmer-sweep px-5 py-2 text-xs font-bold"
                >
                  <span>💬 {t("consultAiBtn")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════ CONFIRM DELETE SINGLE MODAL ════════════════════════ */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-2xl mx-auto">
              🗑️
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác nhận xóa mẫu giám định
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("confirmDeleteOne")}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteItem(deleteTargetId)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-xs font-bold shadow-xs transition"
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════ CONFIRM CLEAR ALL MODAL ════════════════════════ */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác nhận xóa toàn bộ lịch sử
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("confirmClearAll")}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isClearing}
                onClick={handleClearAll}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-xs font-bold shadow-xs transition"
              >
                {isClearing ? "Đang xóa..." : "Xóa tất cả"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

