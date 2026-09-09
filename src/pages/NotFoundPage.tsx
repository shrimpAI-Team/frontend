// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-6xl font-black text-brand-600">404</p>
        <h1 className="mt-3 text-xl font-bold text-slate-900">
          Không tìm thấy trang
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex btn-primary w-auto px-6"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
