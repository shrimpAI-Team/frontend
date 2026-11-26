import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { shrimpApi, type ShrimpAnalysisResponse } from "../api/shrimp.api";
import { api, getApiBaseUrl } from "../lib/api";

const categories = {
  WATER: "Chất lượng nước",
  FEED: "Cho ăn",
  CARE: "Chăm sóc",
  INCIDENT: "Sự cố",
};
type Kind = keyof typeof categories;
const measurements = [
  { key: "ph", label: "pH", min: 0, max: 14 },
  { key: "salinity", label: "Độ mặn (‰)", min: 0 },
  { key: "temperature", label: "Nhiệt độ (°C)" },
  { key: "depth", label: "Mực nước (m)", min: 0 },
  { key: "feedKg", label: "Thức ăn (kg)", min: 0 },
] as const;
type Journal = Record<(typeof measurements)[number]["key"], number | null> & {
  id: string;
  kind: Kind;
  note: string | null;
  simulated: boolean;
  recordedAt: string;
};
type Cycle = {
  id: string;
  species: string;
  startedAt: string;
  endedAt: string | null;
  analysis?: { species: string; confidence: number; imageUrl: string } | null;
};
type Pond = { id: string; name: string; cycles: Cycle[] };
type JournalPage = { items: Journal[]; next: string | null };

const panel = "rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900";
const input = "w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-600";
const primary = "rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-50";
const pondAccent = "rounded-lg bg-linear-[135deg,#06b6d4,#14b8a6] px-4 py-2 font-medium text-slate-950 enabled:hover:brightness-95 disabled:opacity-50";
const secondary = "rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800";
const date = (value: string) => new Date(value).toLocaleString("vi-VN");
const searchableName = (value: string) =>
  value.trim().toLocaleLowerCase("vi").normalize("NFD")
    .replace(/\p{M}/gu, "").replace(/đ/g, "d");

function errorMessage(error: unknown) {
  const message = isAxiosError(error) ? error.response?.data?.message : undefined;
  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string" ? message : "Không thể hoàn tất yêu cầu. Vui lòng thử lại.";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1 text-sm font-medium">{label}{children}</label>;
}

function OpenCycle({ pond, onChange }: { pond: Pond; onChange: () => Promise<void> }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [species, setSpecies] = useState("");
  const [analysis, setAnalysis] = useState<ShrimpAnalysisResponse>();
  const [preview, setPreview] = useState<{ name: string; url: string }>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  async function run(action: () => Promise<void>) {
    setError("");
    setPending(true);
    try { await action(); }
    catch (error) { setError(errorMessage(error)); }
    finally { setPending(false); }
  }

  return (
    <form className={panel + " grid gap-4"} onSubmit={(event) => {
      event.preventDefault();
      void run(async () => {
        await api.post("/ponds/" + pond.id + "/cycles", {
          species: species.trim(), analysisId: analysis?.id,
        });
        await onChange();
      });
    }}>
      <h3 className="font-semibold">Mở vụ nuôi</h3>
      <div className="grid gap-1">
        <p className="text-sm font-medium">Ảnh tôm để nhận diện (tùy chọn)</p>
        <input ref={fileInput} hidden type="file" accept="image/jpeg,image/png,image/webp" disabled={pending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (!file) return;
            setAnalysis(undefined);
            setPreview({ name: file.name, url: URL.createObjectURL(file) });
            void run(async () => {
              const result = await shrimpApi.analyze(file, file.name);
              if (!result.success) throw new Error("Analysis failed");
              setAnalysis(result);
            });
          }} />
        <div className={"flex min-h-36 flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700" +
          (pending ? " cursor-wait" : " cursor-pointer hover:border-teal-400")}
          onClick={(event) => {
            if (!pending && event.target instanceof Element && !event.target.closest("button")) {
              fileInput.current?.click();
            }
          }}>
          {preview ? <>
          <img className="h-28 w-36 rounded-md bg-slate-50 object-contain dark:bg-slate-800"
            src={preview.url} alt="Ảnh tôm đã chọn" />
          <div className="min-w-0 flex-1 space-y-1 text-sm">
            <p className="break-all font-medium">{preview.name}</p>
            {pending && !analysis && (
              <p className="flex items-center gap-2" role="status">
                <span aria-hidden="true" className="size-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />
                Đang tải ảnh và phân tích…
              </p>
            )}
          </div>
          <button className={secondary} type="button" disabled={pending} onClick={() => {
            setPreview(undefined);
            setAnalysis(undefined);
            setError("");
          }}>Bỏ ảnh</button>
          </> : <p className="flex-1 text-sm text-slate-500 dark:text-slate-400">Chưa có ảnh</p>}
          <button className={secondary + " text-sm"} type="button" disabled={pending}
            onClick={() => fileInput.current?.click()}>{preview ? "Đổi ảnh" : "Chọn ảnh"}</button>
        </div>
      </div>
      {analysis && (
        <div className="flex flex-wrap items-center gap-3 text-sm" aria-live="polite">
          <span>{analysis.identificationStatus === "identified"
            ? "AI gợi ý " + analysis.species
            : analysis.description || "AI chưa xác định được loài. Bạn có thể thử ảnh khác."}</span>
          {analysis.identificationStatus === "identified" && (
            <button className={secondary} type="button" disabled={pending}
              onClick={() => setSpecies(analysis.species)}>Dùng gợi ý</button>
          )}
          {!analysis.id && <span>Ảnh chưa được lưu vào lịch sử nhận diện.</span>}
        </div>
      )}
      <Field label="Loài tôm xác nhận">
        <input className={input} value={species} onChange={(event) => setSpecies(event.target.value)}
          placeholder="Ví dụ tôm sú" maxLength={100} required disabled={pending} />
      </Field>
      {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
      <button className={primary + " justify-self-start"} disabled={pending || !species.trim()}>Mở vụ</button>
    </form>
  );
}

function CycleJournal({ cycle, onChange }: { cycle: Cycle; onChange: () => Promise<void> }) {
  const closeDialog = useRef<HTMLDialogElement>(null);
  const [entries, setEntries] = useState<Journal[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>("WATER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const journalUrl = "/ponds/cycles/" + cycle.id + "/journal";

  useEffect(() => {
    const controller = new AbortController();
    api.get<JournalPage>(journalUrl, { signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return;
      setEntries(data.items);
      setNext(data.next);
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setError(errorMessage(error));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [journalUrl]);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError("");
    try { await action(); }
    catch (error) { setError(errorMessage(error)); }
    finally { setPending(false); }
  }

  const fields = kind === "WATER" ? measurements.slice(0, 4) : kind === "FEED" ? measurements.slice(4) : [];

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(fields.flatMap(({ key }) => {
      const value = data.get(key);
      return typeof value === "string" && value !== "" ? [[key, Number(value)]] : [];
    }));
    void run(async () => {
      const { data: entry } = await api.post<Journal>(journalUrl, {
        kind, note: data.get("note"), ...values, simulated: data.has("simulated"),
      });
      setEntries((current) => [entry, ...current]);
      form.reset();
    });
  }

  return (
    <section className={panel + " grid gap-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{cycle.species}</h3>
          <p className="text-sm">Mở {date(cycle.startedAt)} · {cycle.endedAt ? "Kết thúc " + date(cycle.endedAt) : "Đang nuôi"}</p>
        </div>
        {!cycle.endedAt && <button className={secondary} disabled={pending || loading} onClick={() => {
          setError("");
          closeDialog.current?.showModal();
        }}>Kết thúc vụ</button>}
      </div>
      <dialog ref={closeDialog} aria-labelledby="close-cycle-title" aria-describedby="close-cycle-description"
        className={panel + " fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:text-slate-100"}
        onCancel={(event) => { if (pending) event.preventDefault(); }}>
        <h4 id="close-cycle-title" className="text-lg font-semibold">Kết thúc vụ nuôi?</h4>
        <p id="close-cycle-description" className="mt-2 text-sm">
          Bạn vẫn có thể xem lại nhật ký đã lưu sau khi kết thúc vụ.
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button className={secondary} type="button" disabled={pending}
            onClick={() => closeDialog.current?.close()}>Hủy</button>
          <button className={primary} type="button" disabled={pending} onClick={() => void run(async () => {
            await api.post("/ponds/cycles/" + cycle.id + "/close");
            closeDialog.current?.close();
            await onChange();
          })}>{pending ? "Đang kết thúc…" : "Kết thúc vụ"}</button>
        </div>
      </dialog>
      {cycle.analysis && (
        <div className="flex items-center gap-3 text-sm">
          <img className="size-16 rounded-lg object-cover" alt="Ảnh tôm đã dùng để nhận diện"
            src={getApiBaseUrl() + cycle.analysis.imageUrl} />
          <span>Kết quả AI · {cycle.analysis.species}</span>
        </div>
      )}
      {!cycle.endedAt && (
        <form className="grid gap-3 border-y border-slate-200 py-4 dark:border-slate-700" onSubmit={save}>
          <h4 className="font-semibold">Thêm nhật ký</h4>
          <fieldset className="grid gap-3" disabled={pending || loading}>
            <Field label="Loại bản ghi">
              <select className={input} value={kind} onChange={(event) => setKind(event.target.value as Kind)}>
                {Object.entries(categories).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {fields.map((field) => (
                <Field key={field.key} label={field.label}>
                  <input className={input} name={field.key} type="number" step="any"
                    min={"min" in field ? field.min : undefined} max={"max" in field ? field.max : undefined}
                    required={kind === "FEED"} />
                </Field>
              ))}
            </div>
            {kind === "WATER" && <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="simulated" /> Dữ liệu mô phỏng
            </label>}
            <Field label="Ghi chú">
              <textarea className={input} name="note" rows={2} maxLength={2000}
                required={kind === "CARE" || kind === "INCIDENT"} />
            </Field>
            <button className={primary + " justify-self-start"}>Lưu nhật ký</button>
          </fieldset>
        </form>
      )}
      <h4 className="font-semibold">Lịch sử nhật ký</h4>
      {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p role="status">Đang tải nhật ký…</p>}
      {!loading && !entries.length && !error && <p>Chưa có bản ghi.</p>}
      <ol className="grid gap-2">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <strong>{categories[entry.kind]}</strong>
              <time dateTime={entry.recordedAt}>{date(entry.recordedAt)}</time>
              {entry.simulated && <span className="font-medium text-amber-700 dark:text-amber-300">Dữ liệu mô phỏng</span>}
            </div>
            <div className="flex flex-wrap gap-x-4">
              {measurements.map(({ key, label }) => entry[key] != null &&
                <span key={key}>{label} · {entry[key]?.toLocaleString("vi-VN")}</span>)}
            </div>
            {entry.note && <p className="whitespace-pre-wrap break-words">{entry.note}</p>}
          </li>
        ))}
      </ol>
      {next && <button className={secondary + " justify-self-start"} disabled={pending} onClick={() => void run(async () => {
        const { data } = await api.get<JournalPage>(journalUrl, { params: { before: next } });
        setEntries((current) => [...current, ...data.items]);
        setNext(data.next);
      })}>Xem thêm</button>}
    </section>
  );
}

export default function PondsPage() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [pondId, setPondId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const pond = ponds.find((item) => item.id === pondId) ?? ponds[0];
  const query = searchableName(search);
  const visiblePonds = ponds.filter((item) => searchableName(item.name).includes(query));
  const activeCycle = pond?.cycles.find((item) => !item.endedAt);
  const cycle = pond?.cycles.find((item) => item.id === cycleId) ?? activeCycle ?? pond?.cycles[0];

  async function refresh() {
    const { data } = await api.get<Pond[]>("/ponds");
    setPonds(data);
  }

  useEffect(() => {
    const controller = new AbortController();
    api.get<Pond[]>("/ponds", { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setPonds(data); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setError(errorMessage(error)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creating || !name.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const { data } = await api.post<Omit<Pond, "cycles">>("/ponds", { name: name.trim() });
      setPonds((current) => [{ ...data, cycles: [] }, ...current]);
      setPondId(data.id);
      setCycleId("");
      setName("");
      setSearch("");
      setShowCreate(false);
    } catch (error) {
      setCreateError(errorMessage(error));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 text-slate-900 dark:text-slate-100 [&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <h1 className="text-2xl font-bold">Quản lý ao và nhật ký nuôi</h1>
      {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p role="status">Đang tải danh sách ao…</p>}
      <div className="grid items-start gap-5 md:grid-cols-[16rem_1fr]">
        <aside className={panel + " grid gap-4"}>
          <h2 className="font-semibold">Danh sách ao</h2>
          <Field label="Tìm ao">
            <input className={input} type="search" value={search}
              onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên ao" />
          </Field>
          {!showCreate && (
            <button className={pondAccent} type="button" disabled={loading}
              onClick={() => setShowCreate(true)}>Tạo ao mới</button>
          )}
          {showCreate && (
            <form className="grid gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              onSubmit={(event) => void create(event)}>
              <Field label="Tên ao mới">
                <input className={input} value={name} onChange={(event) => setName(event.target.value)}
                  required maxLength={100} placeholder="Ví dụ Ao A1" disabled={creating} />
              </Field>
              {createError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{createError}</p>}
              <div className="flex flex-wrap gap-2">
                <button className={pondAccent} disabled={creating || !name.trim()}>Lưu ao</button>
                <button className={secondary} type="button" disabled={creating} onClick={() => {
                  setShowCreate(false);
                  setName("");
                  setCreateError("");
                }}>Hủy</button>
              </div>
            </form>
          )}
          {!loading && !ponds.length && !error && <p className="text-sm">Thêm ao để bắt đầu ghi nhật ký.</p>}
          {ponds.length > 0 && visiblePonds.length === 0 && <p role="status" className="text-sm">Không tìm thấy ao phù hợp.</p>}
          {visiblePonds.map((item) => (
            <button key={item.id} aria-pressed={pond?.id === item.id}
              className={(pond?.id === item.id ? pondAccent : secondary) + " break-words text-left"}
              onClick={() => { setPondId(item.id); setCycleId(""); }}>
              {item.name}
              <span className="block text-xs">{item.cycles.some(({ endedAt }) => !endedAt) ? "Đang nuôi" : "Chưa có vụ đang nuôi"}</span>
            </button>
          ))}
        </aside>
        {pond && <section className="grid min-w-0 gap-4">
          <h2 className="break-words text-xl font-semibold">{pond.name}</h2>
          {!activeCycle && <OpenCycle key={pond.id} pond={pond} onChange={async () => {
            await refresh();
            setCycleId("");
          }} />}
          {cycle && <>
            <Field label="Vụ nuôi">
              <select className={input} value={cycle.id} onChange={(event) => setCycleId(event.target.value)}>
                {pond.cycles.map((item) => <option key={item.id} value={item.id}>
                  {item.species} · {date(item.startedAt)} · {item.endedAt ? "Đã kết thúc" : "Đang nuôi"}
                </option>)}
              </select>
            </Field>
            <CycleJournal key={cycle.id} cycle={cycle} onChange={refresh} />
          </>}
        </section>}
      </div>
    </div>
  );
}
