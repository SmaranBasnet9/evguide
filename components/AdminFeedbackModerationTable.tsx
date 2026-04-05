"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFeedbackModerationActions from "@/components/AdminFeedbackModerationActions";

type Row = {
  id: string;
  user_id: string;
  owner_name: string | null;
  satisfaction_rating: number;
  feedback: string;
  is_approved: boolean;
  created_at: string;
  email: string;
  evLabel: string;
};

type Props = {
  rows: Row[];
};

export default function AdminFeedbackModerationTable({ rows }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState<"approve" | "unapprove" | "delete" | null>(null);

  const allSelected = useMemo(
    () => rows.length > 0 && selectedIds.length === rows.length,
    [rows.length, selectedIds.length]
  );

  function toggleSelect(feedbackId: string, checked: boolean) {
    setSelectedIds((prev) => {
      if (checked) {
        if (prev.includes(feedbackId)) return prev;
        return [...prev, feedbackId];
      }
      return prev.filter((id) => id !== feedbackId);
    });
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? rows.map((row) => row.id) : []);
  }

  async function runBulkApproval(isApproved: boolean) {
    if (selectedIds.length === 0) {
      alert("Select at least one feedback entry.");
      return;
    }

    setBulkLoading(isApproved ? "approve" : "unapprove");

    const res = await fetch("/api/admin/feedback/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, is_approved: isApproved }),
    });

    setBulkLoading(null);

    if (!res.ok) {
      const result = await res.json();
      alert(result.error ?? "Bulk update failed.");
      return;
    }

    setSelectedIds([]);
    router.refresh();
  }

  async function runBulkDelete() {
    if (selectedIds.length === 0) {
      alert("Select at least one feedback entry.");
      return;
    }

    const ok = window.confirm(`Delete ${selectedIds.length} feedback entr${selectedIds.length === 1 ? "y" : "ies"}?`);
    if (!ok) {
      return;
    }

    setBulkLoading("delete");

    const res = await fetch("/api/admin/feedback/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });

    setBulkLoading(null);

    if (!res.ok) {
      const result = await res.json();
      alert(result.error ?? "Bulk delete failed.");
      return;
    }

    setSelectedIds([]);
    router.refresh();
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {rows.length === 0 ? (
        <p className="px-6 py-10 text-sm text-slate-500">No feedback submitted yet.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">
              Selected: <span className="font-semibold text-slate-900">{selectedIds.length}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => runBulkApproval(true)}
                disabled={bulkLoading !== null || selectedIds.length === 0}
                className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
              >
                {bulkLoading === "approve" ? "Approving..." : "Approve Selected"}
              </button>
              <button
                type="button"
                onClick={() => runBulkApproval(false)}
                disabled={bulkLoading !== null || selectedIds.length === 0}
                className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 disabled:opacity-60"
              >
                {bulkLoading === "unapprove" ? "Updating..." : "Unapprove Selected"}
              </button>
              <button
                type="button"
                onClick={runBulkDelete}
                disabled={bulkLoading !== null || selectedIds.length === 0}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
              >
                {bulkLoading === "delete" ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    aria-label="Select all feedback"
                  />
                </th>
                <th className="px-6 py-3 font-semibold text-slate-600">User</th>
                <th className="px-6 py-3 font-semibold text-slate-600">EV</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Rating</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Feedback</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top last:border-b-0">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => toggleSelect(row.id, e.target.checked)}
                      aria-label={`Select feedback ${row.id}`}
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-medium text-slate-900">{row.owner_name?.trim() || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{row.email}</p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(row.created_at).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{row.evLabel}</td>
                  <td className="px-6 py-4 text-amber-700">{row.satisfaction_rating}/5</td>
                  <td className="px-6 py-4 text-slate-700">{row.feedback}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.is_approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <AdminFeedbackModerationActions feedbackId={row.id} approved={row.is_approved} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
