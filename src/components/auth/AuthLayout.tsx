import logoImg from "../../assets/Logo.png";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main
      className="grid min-h-dvh place-items-center bg-gradient-to-br from-slate-50 via-white
                     to-cyan-50 px-4 py-8 sm:px-6"
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src={logoImg}
            alt="shrimpAI"
            className="mx-auto mb-3 h-16 w-16 object-contain rounded-full ring-4 ring-cyan-500/20 shadow-md transition hover:scale-105"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="card">{children}</div>

        {footer && (
          <div className="mt-5 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
