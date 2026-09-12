import { api } from "../lib/api";

export type Role = "USER" | "ADMIN";
export type TwoFactorMethod = "NONE" | "EMAIL_OTP" | "TOTP";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  role: Role;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  createdAt?: string;
  oauthAccounts?: { provider: string }[];
}

export interface SessionItem {
  id: string;
  deviceId: string;
  deviceName: string | null;
  ip: string | null;
  createdAt: string;
  lastUsedAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
}

export type LoginResult =
  | {
    status: "AUTHENTICATED";
    accessToken: string;
    expiresIn: number;
    user: AuthUser;
    revokedOtherDevices: number;
    session: { id: string; deviceName: string | null };
  }
  | {
    status: "TWO_FACTOR_REQUIRED";
    method: TwoFactorMethod;
    challengeToken: string;
    message: string;
  }
  | { status: "EMAIL_UNVERIFIED"; email: string; message: string };

export const authApi = {
  register: (b: { email: string; password: string; name?: string }) =>
    api
      .post<{
        status: "OTP_SENT";
        email: string;
        message: string;
      }>("/auth/register", b)
      .then((r) => r.data),

  verifyEmail: (b: { email: string; code: string }) =>
    api.post<LoginResult>("/auth/verify-email", b).then((r) => r.data),

  resendOtp: (email: string) =>
    api
      .post<{ message: string }>("/auth/resend-otp", { email })
      .then((r) => r.data),

  login: (b: { email: string; password: string }) =>
    api.post<LoginResult>("/auth/login", b).then((r) => r.data),

  verify2fa: (b: { challengeToken: string; code: string }) =>
    api.post<LoginResult>("/auth/2fa/verify", b).then((r) => r.data),

  exchangeOAuth: (token: string) =>
    api
      .post<LoginResult>("/auth/oauth/exchange", { token })
      .then((r) => r.data),

  me: () => api.get<AuthUser>("/auth/me").then((r) => r.data),

  sessions: () => api.get<SessionItem[]>("/auth/sessions").then((r) => r.data),

  logout: () =>
    api.post<{ message: string }>("/auth/logout").then((r) => r.data),

  logoutAll: () =>
    api.post<{ message: string }>("/auth/logout-all").then((r) => r.data),

  enable2fa: (method: "EMAIL_OTP" | "TOTP") =>
    api
      .post<
        | { status: "ENABLED"; method: "EMAIL_OTP"; message: string }
        | {
          status: "TOTP_SETUP_PENDING";
          otpauthUrl: string;
          qrDataUrl: string;
          secret: string;
          message: string;
        }
      >("/auth/2fa/enable", { method })
      .then((r) => r.data),

  confirmTotp: (code: string) =>
    api
      .post<{
        twoFactorEnabled: true;
        method: "TOTP";
      }>("/auth/2fa/totp/confirm", { code })
      .then((r) => r.data),

  requestDisable2fa: () =>
    api
      .post<{ message: string }>("/auth/2fa/disable/request")
      .then((r) => r.data),

  disable2fa: (b: { password: string; code: string }) =>
    api
      .delete<{ status: "DISABLED"; message: string }>("/auth/2fa", { data: b })
      .then((r) => r.data),

  oauthUrl: (provider: "google" | "facebook" | "zalo") =>
    `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/auth/${provider}`,
};
