// src/store/auth.store.ts
import { create } from "zustand";
import { authApi, type AuthUser, type LoginResult } from "../api/auth.api";
import { setAccessToken, getAccessToken, api } from "../lib/api";

interface AuthState {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "guest";
  notice: string | null;

  bootstrap: () => Promise<void>;
  applyResult: (r: LoginResult) => LoginResult;
  refreshUser: () => Promise<void>;
  setNotice: (msg: string | null) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forceLogout: (reason: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  notice: null,

  /** Gọi 1 lần khi app khởi động: thử refresh cookie ⇒ lấy /me */
  bootstrap: async () => {
    try {
      if (!getAccessToken()) {
        const { data } = await api.post("/auth/refresh", {});
        if (!data?.accessToken) {
          setAccessToken(null);
          set({ user: null, status: "guest" });
          return;
        }
        setAccessToken(data.accessToken);
      }
      const user = await authApi.me();
      set({ user, status: "authenticated" });
    } catch {
      setAccessToken(null);
      set({ user: null, status: "guest" });
    }
  },

  applyResult: (r) => {
    if (r.status === "AUTHENTICATED") {
      setAccessToken(r.accessToken);
      set({
        user: r.user,
        status: "authenticated",
        notice:
          r.revokedOtherDevices > 0
            ? `Đã đăng xuất ${r.revokedOtherDevices} thiết bị khác để bảo vệ tài khoản`
            : null,
      });
    }
    return r;
  },

  refreshUser: async () => {
    const user = await authApi.me();
    set({ user });
  },

  setNotice: (notice) => set({ notice }),

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      set({ user: null, status: "guest", notice: null });
    }
  },

  logoutAll: async () => {
    try {
      await authApi.logoutAll();
    } finally {
      setAccessToken(null);
      set({
        user: null,
        status: "guest",
        notice: "Đã đăng xuất toàn bộ thiết bị",
      });
    }
  },

  forceLogout: (reason) => {
    setAccessToken(null);
    set({ user: null, status: "guest", notice: reason });
  },
}));

export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "ADMIN");
