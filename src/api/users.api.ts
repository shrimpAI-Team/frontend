// src/api/users.api.ts
import { api } from "../lib/api";
import type { Role } from "./auth.api";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  twoFactorEnabled: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  _count: { sessions: number };
}

export const usersApi = {
  list: (q?: string) =>
    api
      .get<AdminUserRow[]>("/users", { params: q ? { q } : undefined })
      .then((r) => r.data),
  setRole: (id: string, role: Role) =>
    api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  setStatus: (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/status`, { isActive }).then((r) => r.data),
};
