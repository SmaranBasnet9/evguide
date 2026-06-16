"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Props {
  listingId:     string;
  currentStatus: string;
}

export default function VendorListingModerationForm({ listingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  async function moderate(action: "approve" | "reject") {
    setError("");
    if (action === "reject" && !rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/vendor-listings/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason: rejectionReason.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Action failed."); return; }
      router.push("/admin/vendor-listings");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(""); }
  }

  const canModerate = currentStatus === "pending_review";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-gray-900 text-sm">Moderation</h2>

      {!canModerate && (
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
          This listing is <strong>{currentStatus.replace(/_/g, " ")}</strong> — no moderation action required.
        </p>
      )}

      {canModerate && (
        <>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Rejection Reason</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="Required if rejecting…"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none transition"
            />
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => moderate("approve")}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve & Publish
            </button>
            <button
              onClick={() => moderate("reject")}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
            >
              {loading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject
            </button>
          </div>
        </>
      )}
    </section>
  );
}
