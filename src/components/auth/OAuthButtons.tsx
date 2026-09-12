import { authApi } from "../../api/auth.api";

export function OAuthButtons({ disabled }: { disabled?: boolean }) {
  const go = (p: "google" | "facebook" | "zalo") => {
    window.location.href = authApi.oauthUrl(p);
  };

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {/* Google */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => go("google")}
        className="btn-ghost"
        title="Đăng nhập bằng Google"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
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
        <span>Google</span>
      </button>

      {/* Facebook */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => go("facebook")}
        className="btn-ghost"
        title="Đăng nhập bằng Facebook"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path
            fill="#1877F2"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
        <span>Facebook</span>
      </button>

      {/* Zalo */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => go("zalo")}
        className="btn-ghost"
        title="Đăng nhập bằng Zalo"
      >
        <svg
          viewBox="0 0 48 48"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <rect width="48" height="48" rx="10" fill="#0068FF" />
          <path
            fill="#FFFFFF"
            d="M12.5 15h9.8v3.1l-6 8.3h6.5v3.6h-11v-3.1l6-8.3h-5.3V15zm11.5 5.8c0-1.8 1.4-3.1 3.2-3.1 1.8 0 3.2 1.3 3.2 3.1v8.8h-3v-1.2c-.6.9-1.6 1.4-2.7 1.4-2.1 0-3.7-1.6-3.7-3.9 0-2.3 1.6-3.9 3.7-3.9 1.1 0 2.1.5 2.7 1.4v-2.6h-.4c-.9 0-1.7-.3-2.1-.8-.4-.5-.6-1.2-.6-2.1l-.3-.1zm3.4 4.8c-1.1 0-1.9.8-1.9 1.9s.8 1.9 1.9 1.9 1.9-.8 1.9-1.9-.8-1.9-1.9-1.9zm7.3-8.6h3.1v15h-3.1V17zm7.5 4.5c2.4 0 4.1 1.8 4.1 4.3s-1.7 4.3-4.1 4.3-4.1-1.8-4.1-4.3 1.7-4.3 4.1-4.3zm0 2.6c-1.1 0-1.9.8-1.9 1.7 0 .9.8 1.7 1.9 1.7s1.9-.8 1.9-1.7c0-.9-.8-1.7-1.9-1.7z"
          />
        </svg>
        <span>Zalo</span>
      </button>
    </div>
  );
}
