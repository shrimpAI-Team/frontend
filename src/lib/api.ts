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

const ERROR_MAP: Record<string, { vi: string; en: string }> = {
  "email must be an email": {
    vi: "Email không đúng định dạng",
    en: "Email must be a valid email address",
  },
  "email should not be empty": {
    vi: "Email không được để trống",
    en: "Email should not be empty",
  },
  "email must not be empty": {
    vi: "Email không được để trống",
    en: "Email must not be empty",
  },
  "password must be a string": {
    vi: "Mật khẩu không hợp lệ",
    en: "Password must be a valid string",
  },
  "password should not be empty": {
    vi: "Mật khẩu không được để trống",
    en: "Password should not be empty",
  },
  "password must not be empty": {
    vi: "Mật khẩu không được để trống",
    en: "Password must not be empty",
  },
  "Unauthorized": {
    vi: "Email hoặc mật khẩu không chính xác",
    en: "Invalid email or password",
  },
  "Email hoặc mật khẩu không đúng": {
    vi: "Email hoặc mật khẩu không đúng",
    en: "Invalid email or password",
  },
  "Tài khoản đã bị vô hiệu hoá": {
    vi: "Tài khoản đã bị vô hiệu hoá",
    en: "Account has been deactivated",
  },
  "SESSION_REVOKED": {
    vi: "Tài khoản của bạn vừa đăng nhập trên thiết bị khác",
    en: "Your account was logged in on another device",
  },
  "SESSION_EXPIRED": {
    vi: "Phiên đăng nhập đã hết hạn do không hoạt động",
    en: "Session expired due to inactivity",
  },
  "Email đã được sử dụng": {
    vi: "Email đã được sử dụng, vui lòng chọn email khác",
    en: "Email is already in use",
  },
  "Mã OTP đã hết hạn": {
    vi: "Mã OTP đã hết hạn",
    en: "OTP code has expired",
  },
  "Mã OTP không đúng": {
    vi: "Mã OTP không đúng",
    en: "Invalid OTP code",
  },
  "ThrottlerException: Too Many Requests": {
    vi: "Quá nhiều yêu cầu, vui lòng thử lại sau giây lát",
    en: "Too many requests, please try again in a moment",
  },
};

function translateErrorMessage(msgStr: string): string {
  const lang =
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("app.lang")) ||
    "vi";
  const normalized = msgStr.trim();

  if (ERROR_MAP[normalized]) {
    return lang === "en"
      ? ERROR_MAP[normalized].en
      : ERROR_MAP[normalized].vi;
  }

  for (const [key, trans] of Object.entries(ERROR_MAP)) {
    if (normalized.toLowerCase().includes(key.toLowerCase())) {
      return lang === "en" ? trans.en : trans.vi;
    }
  }

  return msgStr;
}

export const apiError = (e: unknown, fallback = "Có lỗi xảy ra") => {
  const lang =
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("app.lang")) ||
    "vi";
  const err = e as AxiosError<any>;
  if (err?.code === "ERR_NETWORK" || err?.message?.includes("Network Error")) {
    return lang === "en"
      ? "Cannot connect to backend server. Please check your network connection."
      : "Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra kết nối mạng.";
  }
  const msg = err?.response?.data?.message;
  if (msg) {
    if (Array.isArray(msg)) {
      return msg.map(translateErrorMessage).join(", ");
    }
    return translateErrorMessage(String(msg));
  }
  if (err?.message && !err.message.includes("AxiosError")) {
    return translateErrorMessage(err.message);
  }
  return translateErrorMessage(fallback);
};
