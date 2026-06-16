"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

type Props = {
  id: string;
  status: string;
  condition?: "new" | "used" | null;
};

export default function DealerVehicleActions({ id, status, condition }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<"withdraw" | "delete" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const viewHref = condition === "new" ? `/cars/dealer-${id}` : `/used-evs/${id}`;

  async function handleWithdraw() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/dealer/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "withdraw" }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to withdraw.");
      setConfirming(null);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/dealer/vehicles/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to remove.");
      setConfirming(null);
    }
  }

  if (confirming === "withdraw") {
    return (
      <span className="flex items-center gap-2">
        <button onClick={handleWithdraw} disabled={loading} className="text-xs font-semibold text-amber-400 hover:underline disabled:opacity-50">
          {loading ? "Withdrawing…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(null)} className="text-xs font-semibold text-white/40 hover:underline">Cancel</button>
      </span>
    );
  }

  if (confirming === "delete") {
    return (
      <span className="flex items-center gap-2">
        <button onClick={handleDelete} disabled={loading} className="text-xs font-semibold text-red-400 hover:underline disabled:opacity-50">
          {loading ? "Removing…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(null)} className="text-xs font-semibold text-white/40 hover:underline">Cancel</button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3">
      {status === "live" ? (
        <Link
          href={viewHref}
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-brand"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      ) : null}

      <Link
        href={`/dealer/vehicles/${id}/edit`}
        className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-brand"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>

      {status === "live" ? (
        <button
          onClick={() => setConfirming("withdraw")}
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-amber-400"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Unapprove
        </button>
      ) : (
        <button
          onClick={() => setConfirming("delete")}
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      )}

      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </span>
  );
}
