import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">404</p>
        <h1 className="mt-2 text-4xl font-black text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-3 text-base text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover"
        >
          Back to home
        </Link>
        <Link
          href="/vehicles"
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
        >
          Browse EVs
        </Link>
      </div>
    </div>
  );
}
