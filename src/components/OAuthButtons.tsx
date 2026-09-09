import { authApi } from "../api/auth.api";

export function OAuthButtons({ disabled }: { disabled?: boolean }) {
  const go = (p: "google" | "github") => {
    window.location.href = authApi.oauthUrl(p);
  };

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => go("google")}
        className="btn-ghost"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.6a4.8 4.8 0 01-2.08 3.15v2.6h3.36C20.85 18 22 15.35 22 12.2z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.36-2.6c-.93.63-2.13 1-3.27 1-2.52 0-4.65-1.7-5.42-3.98H3.1v2.5A10 10 0 0012 22z"
          />
          <path
            fill="#FBBC05"
            d="M6.58 13.99a6 6 0 010-3.84v-2.5H3.1a10 10 0 000 8.85l3.48-2.5z"
          />
          <path
            fill="#EA4335"
            d="M12 6.05c1.47 0 2.78.5 3.82 1.5l2.85-2.85C16.96 3.06 14.7 2 12 2A10 10 0 003.1 7.65l3.48 2.5C7.35 7.87 9.48 6.05 12 6.05z"
          />
        </svg>
        Google
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => go("github")}
        className="btn-ghost"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-slate-900"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
        </svg>
        GitHub
      </button>
    </div>
  );
}
