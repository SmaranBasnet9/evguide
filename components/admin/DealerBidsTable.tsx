"use client";

import { useState } from "react";
import { CheckCircle, Clock, Mail } from "lucide-react";

type BidRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  ev_model_label: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

function formatDate(v: string) {
  return new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function parseNotes(notes: string | null): Record<string, string> {
  if (!notes) return {};
  const result: Record<string, string> = {};
  for (const line of notes.split("\n")) {
    const colon = line.indexOf(":");
    if (colon > 0) {
      result[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
    }
  }
  return result;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "border-amber-200 bg-amber-50 text-amber-700",
  contacted: "border-brand/20 bg-brand/10 text-brand",
  resolved:  "border-gray-200 bg-gray-100 text-gray-400",
};

export default function DealerBidsTable({ requests }: { requests: BidRequest[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});

  async function updateStatus(id: string, status: string) {
    setStatusUpdates((prev) => ({ ...prev, [id]: status }));
    await fetch(`/api/admin/dealer-bids/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => null);
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-400">
        No dealer bid requests yet. They appear here when buyers request quotes via the Dealer Bid Engine.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Table header */}
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          <span>Buyer</span>
          <span>Vehicle &amp; spec</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {requests.map((req) => {
          const currentStatus = statusUpdates[req.id] ?? req.status;
          const parsed = parseNotes(req.notes);
          const isExpanded = expanded === req.id;

          return (
            <div key={req.id} className="transition-colors hover:bg-gray-50">
              <div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 px-5 py-4">
                {/* Buyer */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{req.full_name}</p>
                  <p className="truncate text-xs text-gray-400">{req.email}</p>
                  {req.phone && <p className="text-xs text-gray-400">{req.phone}</p>}
                  <p className="mt-1 text-[10px] text-gray-400">{formatDate(req.created_at)}</p>
                </div>

                {/* Vehicle & spec */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {req.ev_model_label ?? "Unknown vehicle"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {parsed["finance type"] && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                        {parsed["finance type"]}
                      </span>
                    )}
                    {parsed["max budget"] && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                        {parsed["max budget"]}
                      </span>
                    )}
                    {parsed["monthly target"] && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                        {parsed["monthly target"]}/mo
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[currentStatus] ?? STATUS_STYLES.pending}`}>
                  {currentStatus === "contacted" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {currentStatus}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : req.id)}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    {isExpanded ? "Less" : "Details"}
                  </button>
                  {currentStatus === "pending" && (
                    <button
                      onClick={() => updateStatus(req.id, "contacted")}
                      className="flex items-center gap-1.5 rounded-lg border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/20"
                    >
                      <Mail className="h-3 w-3" />
                      Forward
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {Object.entries(parsed).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 capitalize">{key}</p>
                        <p className="mt-1 text-xs font-medium text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 pt-2">
                    <a
                      href={`mailto:${req.email}?subject=Your%20${encodeURIComponent(req.ev_model_label ?? "EV")}%20quote%20from%20EVGuide`}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:text-gray-900"
                    >
                      <Mail className="h-3 w-3" />
                      Email buyer
                    </a>
                    {currentStatus !== "resolved" && (
                      <button
                        onClick={() => updateStatus(req.id, "resolved")}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:text-gray-700"
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
