"use client";

import { useState } from "react";

const STATUS_CYCLE: Record<string, string> = {
  pending: "contacted",
  contacted: "resolved",
  resolved: "pending",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  contacted: "Contacted",
  resolved: "Resolved",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

export default function AdminConsultationStatusButton({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function cycle() {
    const next = STATUS_CYCLE[status] ?? "pending";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (res.ok) setStatus(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={cycle}
      disabled={loading}
      title="Click to advance status"
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-opacity disabled:opacity-50 ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </button>
  );
}
