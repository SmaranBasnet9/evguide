"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Download, X } from "lucide-react";

interface Props {
  from: string;
  to: string;
  total: number;
}

export default function EnquiriesToolbar({ from, to, total }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearDates = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.push(`${pathname}?${params.toString()}`);
  };

  const downloadCSV = () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to)   params.set("to", to);
    window.location.href = `/api/admin/enquiries/export?${params.toString()}`;
  };

  const hasFilter = Boolean(from || to);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* From */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => updateParam("from", e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* To */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => updateParam("to", e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* Clear filter */}
      {hasFilter && (
        <button
          onClick={clearDates}
          className="mt-5 flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}

      {/* Spacer */}
      <div className="ml-auto mt-5 flex items-center gap-3">
        <p className="text-xs text-gray-400">
          {total} {total === 1 ? "result" : "results"}
        </p>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>
    </div>
  );
}
