"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, MailOpen, ArrowLeft } from "lucide-react";

export type Enquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  listing_id: string;
  listing?: { brand: string; model: string; year: number } | null;
};

type Tab = "all" | "unread" | "read";

// ── Relative time ──────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function DealerLeadsInbox({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries]     = useState<Enquiry[]>(initialEnquiries);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [tab, setTab]                 = useState<Tab>("all");
  const [markingRead, setMarkingRead] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const filtered =
    tab === "all"    ? enquiries :
    tab === "unread" ? enquiries.filter((e) => !e.is_read) :
                       enquiries.filter((e) => e.is_read);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleMarkRead = async () => {
    if (!selected || selected.is_read) return;
    setMarkingRead(true);
    try {
      const res = await fetch(`/api/dealer/enquiries/${selected.id}`, { method: "PATCH" });
      if (res.ok && mountedRef.current) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selected.id ? { ...e, is_read: true } : e)),
        );
      }
    } finally {
      if (mountedRef.current) setMarkingRead(false);
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "all",    label: "All" },
    { key: "unread", label: `Unread (${enquiries.filter((e) => !e.is_read).length})` },
    { key: "read",   label: "Read" },
  ];

  return (
    <div className="flex h-full min-h-[600px] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Leads</h1>
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelectedId(null); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                tab === key
                  ? "bg-brand/20 text-brand"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Split panel */}
      <div className="flex flex-1 overflow-hidden rounded-2xl border border-white/10">
        {/* ── List panel ── */}
        <div className="flex w-full flex-col overflow-y-auto border-r border-white/[0.06] lg:w-[35%]">
          {filtered.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20 text-sm text-white/40">
              No {tab !== "all" ? tab : ""} leads yet.
            </div>
          ) : (
            filtered.map((enq) => {
              const active = selectedId === enq.id;
              return (
                <button
                  key={enq.id}
                  onClick={() => handleSelect(enq.id)}
                  className={`w-full border-b border-white/[0.04] px-4 py-4 text-left transition ${
                    active
                      ? "bg-brand/10"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread dot */}
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition">
                      {!enq.is_read ? (
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-transparent" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm font-semibold ${enq.is_read ? "text-white/70" : "text-white"}`}>
                          {enq.full_name}
                        </p>
                        <span className="shrink-0 text-[10px] text-white/30">{relativeTime(enq.created_at)}</span>
                      </div>
                      {enq.listing && (
                        <p className="mt-0.5 truncate text-xs text-brand/80">
                          {enq.listing.year} {enq.listing.brand} {enq.listing.model}
                        </p>
                      )}
                      {enq.message && (
                        <p className="mt-1 truncate text-xs text-white/40">{enq.message}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className="hidden flex-1 overflow-y-auto p-6 lg:block">
          {!selected ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MailOpen className="mx-auto mb-3 h-10 w-10 text-white/15" />
                <p className="text-sm text-white/40">Select a lead to view details</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.full_name}</h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-0.5 text-sm text-brand hover:underline"
                  >
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <p className="mt-0.5 text-sm text-white/50">{selected.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                  {selected.is_read
                    ? <><MailOpen className="h-3.5 w-3.5 text-white/30" /><span className="text-xs text-white/30">Read</span></>
                    : <><Mail className="h-3.5 w-3.5 text-blue-400" /><span className="text-xs text-blue-400">Unread</span></>
                  }
                </div>
              </div>

              {/* Vehicle */}
              {selected.listing && (
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  <p className="text-xs text-white/40">Vehicle enquired about</p>
                  <p className="mt-1 font-semibold text-brand">
                    {selected.listing.year} {selected.listing.brand} {selected.listing.model}
                  </p>
                </div>
              )}

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="mb-2 text-xs text-white/40">Message</p>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/80">
                    {selected.message}
                  </div>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-white/30">
                Received{" "}
                {new Date(selected.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  <Mail className="h-4 w-4" />
                  Reply by email
                </a>
                {!selected.is_read && (
                  <button
                    onClick={handleMarkRead}
                    disabled={markingRead}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] disabled:opacity-50"
                  >
                    <MailOpen className="h-4 w-4" />
                    {markingRead ? "Marking..." : "Mark as read"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: detail view overlay */}
      {selected && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:hidden">
          <button
            onClick={() => setSelectedId(null)}
            className="mb-4 flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to list
          </button>

          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">{selected.full_name}</h2>
              <a href={`mailto:${selected.email}`} className="mt-0.5 text-sm text-brand hover:underline">
                {selected.email}
              </a>
              {selected.phone && <p className="mt-0.5 text-sm text-white/50">{selected.phone}</p>}
            </div>

            {selected.listing && (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-white/40">Vehicle enquired about</p>
                <p className="mt-1 font-semibold text-brand">
                  {selected.listing.year} {selected.listing.brand} {selected.listing.model}
                </p>
              </div>
            )}

            {selected.message && (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/80">
                {selected.message}
              </div>
            )}

            <p className="text-xs text-white/30">
              Received{" "}
              {new Date(selected.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                <Mail className="h-4 w-4" /> Reply by email
              </a>
              {!selected.is_read && (
                <button
                  onClick={handleMarkRead}
                  disabled={markingRead}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <MailOpen className="h-4 w-4" />
                  {markingRead ? "Marking..." : "Mark as read"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
