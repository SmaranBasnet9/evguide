"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";
import type { ExchangeStatus, ExchangePriority } from "@/types";

const STATUS_OPTIONS: { value: ExchangeStatus; label: string }[] = [
  { value: "new",                  label: "New" },
  { value: "contacted",            label: "Contacted" },
  { value: "valuation_reviewed",   label: "Valuation Reviewed" },
  { value: "inspection_scheduled", label: "Inspection Scheduled" },
  { value: "offer_sent",           label: "Offer Sent" },
  { value: "converted",            label: "Converted" },
  { value: "rejected",             label: "Rejected" },
  { value: "archived",             label: "Archived" },
];

const PRIORITY_OPTIONS: { value: ExchangePriority; label: string }[] = [
  { value: "low",    label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high",   label: "High" },
  { value: "urgent", label: "Urgent" },
];

interface AdminExchangeActionsProps {
  id: string;
  currentStatus: string;
  currentPriority: string;
  assignedTo: string;
  adminNotes: string;
  finalOfferValue: string;
}

export default function AdminExchangeActions({
  id,
  currentStatus,
  currentPriority,
  assignedTo,
  adminNotes,
  finalOfferValue,
}: AdminExchangeActionsProps) {
  const router = useRouter();

  const [status,         setStatus]         = useState<string>(currentStatus);
  const [priority,       setPriority]       = useState<string>(currentPriority);
  const [assignedToVal,  setAssignedToVal]  = useState<string>(assignedTo);
  const [notes,          setNotes]          = useState<string>(adminNotes);
  const [finalOffer,     setFinalOffer]     = useState<string>(finalOfferValue);
  const [activityNote,   setActivityNote]   = useState<string>("");
  const [saving,         setSaving]         = useState(false);
  const [message,        setMessage]        = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/exchange-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          assigned_to:       assignedToVal.trim() || null,
          admin_notes:       notes.trim() || null,
          final_offer_value: finalOffer ? parseFloat(finalOffer) : null,
          _activity_note:    activityNote.trim() || null,
          _created_by:       "admin",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMessage({ text: json.error ?? "Save failed.", ok: false });
        return;
      }

      setMessage({ text: "Saved successfully.", ok: true });
      setActivityNote("");
      router.refresh();
    } catch {
      setMessage({ text: "Something went wrong.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote() {
    if (!activityNote.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/exchange-requests/${id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_type: "note_added",
          note:        activityNote.trim(),
          created_by:  "admin",
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setMessage({ text: json.error ?? "Failed to add note.", ok: false });
        return;
      }

      setMessage({ text: "Note added.", ok: true });
      setActivityNote("");
      router.refresh();
    } catch {
      setMessage({ text: "Something went wrong.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none";
  const labelCls = "mb-1 block text-xs font-semibold text-slate-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-700">
        Manage Request
      </h2>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
            message.ok
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.ok ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {message.text}
        </div>
      )}

      <div>
        <label className={labelCls}>Status</label>
        <select
          className={inputCls}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Priority</label>
        <select
          className={inputCls}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Assigned to</label>
        <input
          className={inputCls}
          value={assignedToVal}
          onChange={(e) => setAssignedToVal(e.target.value)}
          placeholder="Staff member name"
        />
      </div>

      <div>
        <label className={labelCls}>Final offer value (£)</label>
        <input
          type="number"
          className={inputCls}
          value={finalOffer}
          onChange={(e) => setFinalOffer(e.target.value)}
          placeholder="e.g. 11500"
          min={0}
        />
      </div>

      <div>
        <label className={labelCls}>Internal admin notes</label>
        <textarea
          className={inputCls}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes for the team…"
        />
      </div>

      <div>
        <label className={labelCls}>Activity note (optional, logged on save)</label>
        <input
          className={inputCls}
          value={activityNote}
          onChange={(e) => setActivityNote(e.target.value)}
          placeholder="e.g. Called customer, scheduled inspection"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
        ) : (
          <><Save className="h-4 w-4" /> Save Changes</>
        )}
      </button>

      {/* Quick "add note only" button */}
      {activityNote.trim() && (
        <button
          type="button"
          onClick={handleAddNote}
          disabled={saving}
          className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          Add note only (no status change)
        </button>
      )}
    </div>
  );
}
