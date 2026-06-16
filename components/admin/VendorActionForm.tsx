"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, PauseCircle, RefreshCw, MessageSquare, Loader2 } from "lucide-react";

interface Props {
  vendorId:      string;
  currentStatus: string;
}

export default function VendorActionForm({ vendorId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function runAction(action: string) {
    setError("");
    if ((action === "reject" || action === "request_info") && !notes.trim()) {
      setError("Please provide a reason / notes.");
      return;
    }
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: notes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Action failed."); return; }
      router.refresh();
      setNotes("");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(""); }
  }

  const isPending   = currentStatus === "pending";
  const isVerified  = currentStatus === "verified";
  const isSuspended = currentStatus === "suspended";
  const isRejected  = currentStatus === "rejected";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-gray-900 text-sm">Actions</h2>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Notes / Reason</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Required for Reject and Request Info…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none transition"
        />
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        {(isPending || isSuspended) && (
          <button
            onClick={() => runAction("approve")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve Vendor
          </button>
        )}
        {(isPending || isVerified) && (
          <button
            onClick={() => runAction("reject")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
          >
            {loading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Reject
          </button>
        )}
        {isVerified && (
          <button
            onClick={() => runAction("suspend")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:opacity-60"
          >
            {loading === "suspend" ? <Loader2 className="h-4 w-4 animate-spin" /> : <PauseCircle className="h-4 w-4" />}
            Suspend
          </button>
        )}
        {(isRejected || isSuspended) && (
          <button
            onClick={() => runAction("restore")}
            disabled={!!loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 disabled:opacity-60"
          >
            {loading === "restore" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Restore to Pending
          </button>
        )}
        <button
          onClick={() => runAction("request_info")}
          disabled={!!loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-brand/30 hover:text-brand disabled:opacity-60"
        >
          {loading === "request_info" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
          Request More Info
        </button>
      </div>
    </section>
  );
}
