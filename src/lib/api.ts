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
  if (accessToken) cfg.headers.set("Authorization", `Bearer ${accessToken}`);
  return cfg;
});

let refreshing: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true, headers: { "X-Device-Id": getDeviceId() } },
    );
    accessToken = data?.accessToken ?? null;
    return accessToken;
  } catch {
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

      // Thiết bị khác đã đăng nhập ⇒ phiên bị thu hồi
      onSessionLost?.(
        error.response?.data?.message === "SESSION_REVOKED"
          ? "Tài khoản của bạn vừa đăng nhập trên thiết bị khác"
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
