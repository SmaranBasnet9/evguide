"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";

type Props = {
  id: string;
  status: string;
  condition?: "new" | "used" | null;
};

export default function AdminDealerListingActions({ id, status, condition }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<"unapprove" | "delete" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const viewHref = condition === "new" ? `/cars/dealer-${id}` : `/used-evs/${id}`;

  async function handleUnapprove() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/dealer-listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unapprove" }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to unapprove.");
      setConfirming(null);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/dealer-listings/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to remove.");
      setConfirming(null);
    }
  }

  if (confirming === "unapprove") {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleUnapprove} disabled={loading} className="text-xs font-semibold text-amber-600 hover:underline disabled:opacity-50">
          {loading ? "Working…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(null)} className="text-xs font-semibold text-gray-400 hover:underline">Cancel</button>
      </div>
    );
  }

  if (confirming === "delete") {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} disabled={loading} className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
          {loading ? "Removing…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(null)} className="text-xs font-semibold text-gray-400 hover:underline">Cancel</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {status === "live" ? (
        <Link
          href={viewHref}
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-brand"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      ) : null}

      {status === "live" ? (
        <button
          onClick={() => setConfirming("unapprove")}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-amber-600"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Unapprove
        </button>
      ) : null}

      <button
        onClick={() => setConfirming("delete")}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Remove
      </button>

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
