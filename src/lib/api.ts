import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getDeviceId, getDeviceName } from "./device";

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  // Nếu đã cấu hình VITE_API_URL là domain remote online (khi deploy production)
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  // Môi trường dev (cả trên máy tính lẫn Safari điện thoại qua Wi-Fi):
  // Dùng relative path "" để qua Vite Proxy cùng cổng 5174.
  // Nhờ đó Safari iOS KHÔNG bị chặn Cookie (ITP) và không bị Tường lửa Windows chặn cổng 4000!
  return "";
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

let accessToken: string | null = null;
let onSessionLost: ((reason: string) => void) | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;
export const setSessionLostHandler = (fn: (reason: string) => void) => {
  onSessionLost = fn;
};

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  cfg.headers.set("X-Device-Id", getDeviceId());
  cfg.headers.set("X-Device-Name", getDeviceName());
  cfg.headers.set("X-Client-Type", "client");
  if (accessToken) cfg.headers.set("Authorization", `Bearer ${accessToken}`);
  return cfg;
});

let refreshing: Promise<string | null> | null = null;
let lastRefreshError: string | null = null;

async function doRefresh(): Promise<string | null> {
  try {
    lastRefreshError = null;
    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          "X-Device-Id": getDeviceId(),
          "X-Client-Type": "client",
        },
      },
    );
    accessToken = data?.accessToken ?? null;
    return accessToken;
  } catch (err: any) {
    lastRefreshError = err?.response?.data?.message ?? "REFRESH_FAILED";
    accessToken = null;
    return null;
  } finally {
    refreshing = null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError<any>) => {
    const cfg = error.config as AxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;
    const url = cfg?.url ?? "";
    const origMsg = error.response?.data?.message;

    // Nếu chính phiên này bị thu hồi do đăng nhập ở nơi khác, out ngay mà không cố refresh
    if (status === 401 && origMsg === "SESSION_REVOKED") {
      accessToken = null;
      onSessionLost?.("Tài khoản của bạn vừa đăng nhập trên thiết bị khác");
      return Promise.reject(error);
    }

    const skip = [
      "/auth/login",
      "/auth/refresh",
      "/auth/register",
      "/auth/2fa/verify",
    ];
    if (
      status === 401 &&
      !cfg?._retried &&
      !skip.some((s) => url.includes(s))
    ) {
      cfg._retried = true;
      refreshing ??= doRefresh();
      const token = await refreshing;
      if (token) return api(cfg);

      const isRevoked =
        origMsg === "SESSION_REVOKED" ||
        lastRefreshError === "SESSION_REVOKED";

      const isExpired =
        origMsg === "SESSION_EXPIRED" ||
        lastRefreshError === "SESSION_EXPIRED" ||
        lastRefreshError === "Phiên đã hết hạn";

      onSessionLost?.(
        isRevoked
          ? "Tài khoản của bạn vừa đăng nhập trên thiết bị khác"
          : isExpired
            ? "Phiên đăng nhập đã hết hạn do không hoạt động"
            : "Phiên đăng nhập đã kết thúc",
      );
    }
    return Promise.reject(error);
  },
);

export const apiError = (e: unknown, fallback = "Có lỗi xảy ra") => {
  const err = e as AxiosError<any>;
  if (err?.code === "ERR_NETWORK" || err?.message?.includes("Network Error")) {
    return "Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra kết nối mạng.";
  }
  const msg = err?.response?.data?.message;
  if (msg) {
    return Array.isArray(msg) ? msg.join(", ") : String(msg);
  }
  if (err?.message && !err.message.includes("AxiosError")) {
    return err.message;
  }
  return fallback;
};
