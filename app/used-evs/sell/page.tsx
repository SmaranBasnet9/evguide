"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2, PoundSterling, Battery, Shield } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-white/50";

export default function SellEVPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    colour: "",
    price: "",
    mileage: "",
    location: "",
    contact_email: "",
    contact_phone: "",
    description: "",
    wallbox_included: false,
    service_history_full: false,
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const price = Number(form.price);
    const mileage = Number(form.mileage);
    const year = Number(form.year);

    if (!form.brand.trim() || !form.model.trim()) return setError("Brand and model are required.");
    if (!year || year < 2011 || year > 2026) return setError("Enter a valid year (2011–2026).");
    if (!price || price < 1000) return setError("Enter a valid asking price (minimum £1,000).");
    if (isNaN(mileage) || mileage < 0) return setError("Enter valid mileage.");
    if (!form.location.trim()) return setError("Location is required.");
    if (!form.contact_email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.contact_email)) {
      return setError("Valid contact email required.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/used-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year,
          price,
          mileage,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "Submission failed.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-2xl px-4 pt-8 pb-20">

        <Link
          href="/used-evs"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to listings
        </Link>

        <div className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Sell your EV</p>
          <h1 className="mt-2 text-2xl font-bold">List your electric car</h1>
          <p className="mt-2 text-sm text-white/50">
            Reach serious EV buyers. Your listing includes battery health data and EV-specific specs. One-time listing fee of £25–£75 processed after review.
          </p>
        </div>

        {/* Value props */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { icon: Battery, label: "Battery health",   sub: "We add SOH data" },
            { icon: Shield,  label: "ULEZ verified",    sub: "Auto-checked" },
            { icon: PoundSterling, label: "£25–75 fee", sub: "After review" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <Icon className="mx-auto mb-2 h-4 w-4 text-brand/70" />
              <p className="text-xs font-semibold text-white">{label}</p>
              <p className="mt-0.5 text-[11px] text-white/40">{sub}</p>
            </div>
          ))}
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-14 text-center px-6">
            <CheckCircle className="h-14 w-14 text-emerald-500" />
            <div>
              <p className="text-xl font-bold text-white">Listing submitted!</p>
              <p className="mt-2 text-sm text-white/60">
                Our team will review your listing and contact you within 24 hours about payment and going live.
              </p>
            </div>
            <Link href="/used-evs" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover">
              Browse listings →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Vehicle details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Make *</label>
                  <input className={inputCls} placeholder="e.g. Tesla" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Model *</label>
                  <input className={inputCls} placeholder="e.g. Model 3" value={form.model} onChange={(e) => set("model", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Year *</label>
                  <input className={inputCls} type="number" placeholder="2022" min={2011} max={2026} value={form.year} onChange={(e) => set("year", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Colour</label>
                  <input className={inputCls} placeholder="e.g. Pearl White" value={form.colour} onChange={(e) => set("colour", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Asking price (£) *</label>
                  <input className={inputCls} type="number" placeholder="25000" min={1000} value={form.price} onChange={(e) => set("price", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Mileage *</label>
                  <input className={inputCls} type="number" placeholder="35000" min={0} value={form.mileage} onChange={(e) => set("mileage", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Location *</label>
                <input className={inputCls} placeholder="e.g. London, SW11" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.wallbox_included}
                    onChange={(e) => set("wallbox_included", e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand accent-brand"
                  />
                  <span className="text-sm text-white/70">Wallbox included</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.service_history_full}
                    onChange={(e) => set("service_history_full", e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand accent-brand"
                  />
                  <span className="text-sm text-white/70">Full service history</span>
                </label>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={4}
                  placeholder="Condition, spec, any extras, reason for selling…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Contact details</p>
              <div>
                <label className={labelCls}>Email *</label>
                <input className={inputCls} type="email" placeholder="you@example.com" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Phone (optional)</label>
                <input className={inputCls} type="tel" placeholder="07700 900000" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit listing for review →"}
            </button>

            <p className="text-center text-xs text-white/30">
              Listing is reviewed within 24 hours. £25–75 fee applies upon approval. Your contact details are shared only with serious buyers.
            </p>
          </form>
        )}
      </div>

      <PremiumFooter />
    </main>
  );
}
