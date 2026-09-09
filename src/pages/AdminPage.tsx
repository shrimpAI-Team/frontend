import { useCallback, useEffect, useState } from "react";
import { usersApi, type AdminUserRow } from "../api/users.api";
import type { Role } from "../api/auth.api";
import { apiError } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";

export default function AdminPage() {
  const me = useAuthStore((s) => s.user);
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async (keyword?: string) => {
    setLoading(true);
    try {
      setRows(await usersApi.list(keyword));
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce tìm kiếm 400ms để giảm số request
  useEffect(() => {
    const t = setTimeout(() => load(q || undefined), 400);
    return () => clearTimeout(t);
  }, [q, load]);

  const changeRole = async (u: AdminUserRow, role: Role) => {
    if (u.id === me?.id) return;
    setBusyId(u.id);
    setError("");
    try {
      await usersApi.setRole(u.id, role);
      setSuccess(
        `Đã đổi vai trò của ${u.email} thành ${role}. Người dùng cần đăng nhập lại.`,
      );
      await load(q || undefined);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = async (u: AdminUserRow) => {
    if (u.id === me?.id) return;
    setBusyId(u.id);
    setError("");
    try {
      await usersApi.setStatus(u.id, !u.isActive);
      setSuccess(`Đã ${u.isActive ? "khoá" : "mở khoá"} tài khoản ${u.email}`);
      await load(q || undefined);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            👑 Quản trị người dùng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Phân quyền và khoá tài khoản
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Tìm theo email…"
          aria-label="Tìm kiếm người dùng"
          className="input sm:w-72"
        />
      </header>

      {error && (
        <Alert variant="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-brand-600">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          {/* Bảng cho màn hình lớn */}
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Người dùng</th>
                  <th className="px-4 py-3 font-semibold">Vai trò</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">2FA</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {u.name ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={u.id === me?.id || busyId === u.id}
                        onChange={(e) => changeRole(u, e.target.value as Role)}
                        aria-label={`Vai trò của ${u.email}`}
                        className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm
                                   disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill active={u.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      {u.twoFactorEnabled ? "🔐 Bật" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleStatus(u)}
                        disabled={u.id === me?.id || busyId === u.id}
                        className={`h-9 rounded-lg px-3 text-sm font-semibold transition
                          disabled:opacity-40 ${
                            u.isActive
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                      >
                        {busyId === u.id
                          ? "…"
                          : u.isActive
                            ? "Khoá"
                            : "Mở khoá"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400"
                    >
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Danh sách thẻ cho mobile */}
          <div className="grid gap-3 md:hidden">
            {rows.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {u.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{u.email}</p>
                  </div>
                  <StatusPill active={u.isActive} />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={u.role}
                    disabled={u.id === me?.id || busyId === u.id}
                    onChange={(e) => changeRole(u, e.target.value as Role)}
                    aria-label={`Vai trò của ${u.email}`}
                    className="h-9 flex-1 rounded-lg border border-slate-300 px-2 text-sm disabled:opacity-50"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={() => toggleStatus(u)}
                    disabled={u.id === me?.id || busyId === u.id}
                    className={`h-9 rounded-lg border px-3 text-sm font-semibold disabled:opacity-40 ${
                      u.isActive
                        ? "border-rose-200 text-rose-600"
                        : "border-emerald-200 text-emerald-600"
                    }`}
                  >
                    {u.isActive ? "Khoá" : "Mở khoá"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {active ? "Hoạt động" : "Đã khoá"}
    </span>
  );
}
