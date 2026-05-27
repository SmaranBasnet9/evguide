"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminDealerListingReviewButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const act = async (action: "approve" | "reject") => {
    setLoading(action);
    const res = await fetch(`/api/admin/dealer-listings/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: rejectionReason || undefined }),
    });
    setLoading(null);
    if (res.ok) {
      setShowRejectForm(false);
      router.refresh();
    }
  };

  if (showRejectForm) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Reason (shown to dealer)"
          className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => act("reject")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            <XCircle className="h-4 w-4" />
            {loading === "reject" ? "Rejecting..." : "Confirm"}
          </button>
          <button onClick={() => setShowRejectForm(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => act("approve")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
      >
        <CheckCircle className="h-4 w-4" />
        {loading === "approve" ? "Approving..." : "Approve"}
      </button>
      <button
        onClick={() => setShowRejectForm(true)}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-60"
      >
        <XCircle className="h-4 w-4" />
        Reject
      </button>
    </div>
  );
}
