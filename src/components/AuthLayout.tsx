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
                     to-brand-50 px-4 py-8 sm:px-6"
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl
                          bg-brand-600 text-xl font-black text-white shadow-soft"
          >
            A
          </div>
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
