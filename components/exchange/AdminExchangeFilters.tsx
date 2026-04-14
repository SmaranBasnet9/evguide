"use client";

/**
 * Lightweight client-side search bar rendered inside the admin exchange list.
 * Currently just UI — for a full server-driven search pass params to the URL.
 * Kept separate so the parent page remains a Server Component.
 */
export default function AdminExchangeFilters() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <p className="text-xs text-slate-400">
        Use the status tabs above to filter by lifecycle stage. Click &ldquo;View&rdquo; on any row to manage the full exchange request.
      </p>
    </div>
  );
}
