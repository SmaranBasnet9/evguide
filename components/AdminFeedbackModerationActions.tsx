"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  feedbackId: string;
  approved: boolean;
};

export default function AdminFeedbackModerationActions({ feedbackId, approved }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleApproval() {
    setLoading(true);

    const res = await fetch(`/api/admin/feedback/${feedbackId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: !approved }),
    });

    setLoading(false);

    if (!res.ok) {
      const result = await res.json();
      alert(result.error ?? "Failed to update moderation status.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const ok = window.confirm("Delete this feedback permanently?");
    if (!ok) {
      return;
    }

    setDeleting(true);

    const res = await fetch(`/api/admin/feedback/${feedbackId}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (!res.ok) {
      const result = await res.json();
      alert(result.error ?? "Failed to delete feedback.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleToggleApproval}
        disabled={loading || deleting}
        className={`rounded-lg px-3 py-1 text-xs font-semibold ${
          approved
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        } disabled:opacity-60`}
      >
        {loading ? "Saving..." : approved ? "Unapprove" : "Approve"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading || deleting}
        className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
