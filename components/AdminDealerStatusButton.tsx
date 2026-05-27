"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  dealerProfileId: string;
  userId: string;
  currentStatus: string;
};

const ACTIONS: Record<string, { label: string; next: string; cls: string }[]> = {
  pending_approval: [
    { label: "Approve", next: "approve",  cls: "bg-brand hover:bg-brand-hover text-white" },
    { label: "Reject",  next: "reject",   cls: "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20" },
  ],
  approved: [
    { label: "Suspend", next: "suspend",  cls: "border border-orange-500/20 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20" },
  ],
  suspended: [
    { label: "Reinstate", next: "approve", cls: "bg-brand hover:bg-brand-hover text-white" },
  ],
  rejected: [
    { label: "Approve", next: "approve",  cls: "bg-brand hover:bg-brand-hover text-white" },
  ],
};

export default function AdminDealerStatusButton({ dealerProfileId, userId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const actions = ACTIONS[currentStatus] ?? [];

  const act = async (action: string) => {
    if (action === "reject" && !showReason) {
      setShowReason(true);
      return;
    }
    setLoading(action);
    const res = await fetch(`/api/admin/dealers/${dealerProfileId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId, reason: reason || undefined }),
    });
    setLoading(null);
    if (res.ok) {
      setShowReason(false);
      setReason("");
      router.refresh();
    }
  };

  if (showReason) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Rejection reason (optional)"
          className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-red-400 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => act("reject")}
            disabled={loading !== null}
            className="rounded-xl bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading === "reject" ? "Rejecting..." : "Confirm reject"}
          </button>
          <button
            onClick={() => setShowReason(false)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {actions.map(({ label, next, cls }) => (
        <button
          key={next}
          onClick={() => act(next)}
          disabled={loading !== null}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${cls}`}
        >
          {loading === next ? `${label}ing...` : label}
        </button>
      ))}
    </div>
  );
}
