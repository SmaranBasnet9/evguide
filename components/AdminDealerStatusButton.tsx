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
    { label: "Reject",  next: "reject",   cls: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" },
  ],
  approved: [
    { label: "Suspend", next: "suspend",  cls: "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100" },
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
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none"
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
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:text-gray-900"
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
