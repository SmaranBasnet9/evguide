"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Loader2, MessageSquare } from "lucide-react";

export type EnquiryContext = {
  vehicleId?: string;
  vehicleLabel?: string;
  defaultType?: EnquiryType;
};

type EnquiryType = "General" | "Vehicle Quote" | "Finance" | "Test Drive" | "Part Exchange";

const ENQUIRY_TYPES: EnquiryType[] = [
  "General",
  "Vehicle Quote",
  "Finance",
  "Test Drive",
  "Part Exchange",
];

const TYPE_TO_INTEREST: Record<EnquiryType, string> = {
  "General":        "general",
  "Vehicle Quote":  "quote",
  "Finance":        "finance",
  "Test Drive":     "test_drive",
  "Part Exchange":  "exchange",
};

interface EnquiryModalProps {
  context?: EnquiryContext;
  onClose: () => void;
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand/20";

export default function EnquiryModal({ context, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: (context?.defaultType ?? "General") as EnquiryType,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim())  return setError("Please enter your full name.");
    if (!form.email.trim() || !form.email.includes("@")) return setError("Please enter a valid email address.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          interest_type: TYPE_TO_INTEREST[form.type],
          vehicle_id: context?.vehicleId ?? null,
          vehicle_label: context?.vehicleLabel ?? null,
          message:
            form.message.trim() ||
            `${form.type} enquiry${context?.vehicleLabel ? ` — ${context.vehicleLabel}` : ""}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      }

      setDone(true);
      setTimeout(() => onClose(), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0E0E0E] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/40 transition hover:border-white/20 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
              <MessageSquare className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Make an Enquiry</p>
              <h2 className="mt-0.5 text-xl font-bold text-white">
                {context?.vehicleLabel ?? "Get in Touch"}
              </h2>
              <p className="mt-0.5 text-sm text-white/40">
                Fill in your details and we&apos;ll get back to you shortly.
              </p>
            </div>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle className="h-14 w-14 text-brand" />
              <p className="text-lg font-bold text-white">Enquiry received!</p>
              <p className="text-sm text-white/50">
                Enquiry submitted. We&apos;ll be in touch{context?.vehicleLabel ? ` about the ${context.vehicleLabel}` : ""} within a few hours.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Enquiry type */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ENQUIRY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("type", t)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        form.type === t
                          ? "border-brand/50 bg-brand/15 text-brand"
                          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                  autoComplete="name"
                />
                <input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                  autoComplete="email"
                />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                  autoComplete="tel"
                />
                <textarea
                  placeholder="Message or questions (optional)"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
                >
                  {submitting
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : "Send Enquiry"
                  }
                </button>

                <p className="text-center text-xs text-white/25">
                  Your details are handled securely and never sold to third parties.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
