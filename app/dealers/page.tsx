"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap, Code2, BarChart3, Shield, CheckCircle, Loader2,
  ArrowRight, ExternalLink, Sparkles, TrendingUp, Users,
} from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-white/50";

const PLANS = [
  {
    name: "Starter",
    price: "£500/mo",
    desc: "Perfect for single-brand EV dealers",
    features: [
      "AI Match widget embed",
      "Up to 500 monthly sessions",
      "Your branding + colours",
      "Lead capture to your CRM",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    price: "£1,000/mo",
    desc: "Multi-model dealers and groups",
    features: [
      "Everything in Starter",
      "Unlimited sessions",
      "Custom model inventory sync",
      "Finance calculator integration",
      "Analytics dashboard",
      "Dedicated success manager",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "£2,000/mo",
    desc: "Dealer groups and OEM partners",
    features: [
      "Everything in Professional",
      "White-label mobile app",
      "API access",
      "Custom AI training on your stock",
      "SLA + phone support",
      "Usage-based OEM data reporting",
    ],
    highlight: false,
  },
];

export default function DealersPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", dealership: "", phone: "", website: "",
    monthly_leads: "", message: "",
  });

  function setF(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("Name required.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) return setFormError("Valid email required.");
    if (!form.dealership.trim()) return setFormError("Dealership name required.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/dealer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthly_leads: form.monthly_leads ? Number(form.monthly_leads) : null,
          plan: selectedPlan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed.");
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">

        {/* Hero */}
        <div className="mb-14 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-xs font-semibold text-brand mb-6">
              <Code2 className="h-3.5 w-3.5" />
              EVGuide Partner Programme
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Embed EVGuide&apos;s AI Match engine on your dealership website.
            </h1>
            <p className="mt-5 text-lg text-white/50 leading-relaxed">
              Your customers use our battle-tested EV matching AI — fully branded as yours. Convert more leads with EV-specific intelligence your website currently can&apos;t offer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Apply to partner <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/consultation"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
              >
                See live demo <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Widget preview */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-white/30 font-mono">yourdealer.co.uk/match</span>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 border border-brand/20">
                  <Sparkles className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AI EV Match — <span className="text-brand">YourBrand</span></p>
                  <p className="text-xs text-white/40">Powered by EVGuide intelligence</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                <p className="text-xs text-white/50 mb-2">Tell me about your commute…</p>
                <div className="space-y-2">
                  {["Daily: 45 miles round trip", "Occasional motorway", "Home charging available"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 text-brand/60 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-brand/20 bg-brand/8 p-3">
                <p className="text-xs font-semibold text-brand">Top match → Tesla Model 3 LR</p>
                <p className="text-xs text-white/40">294mi range · 96% commute confidence · £338/mo PCP</p>
              </div>
              <p className="text-[10px] text-white/20 text-center">White-labelled — your branding, our intelligence</p>
            </div>
          </div>
        </div>

        {/* Why EVGuide vs DIY */}
        <div className="mb-14">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">The business case</p>
            <h2 className="mt-2 text-2xl font-bold">Turn competitors into customers</h2>
            <p className="mt-2 text-white/50 text-sm max-w-xl mx-auto">
              Carwow and AutoTrader don&apos;t offer EV-specific matching. EVGuide licenses our engine so your dealership is the smartest in the room.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles,   title: "EV-native AI",         desc: "Trained on UK-specific EV data: charging, range, commute fit, tariffs" },
              { icon: TrendingUp, title: "3× lead quality",      desc: "Pre-qualified buyers already matched to models you stock" },
              { icon: BarChart3,  title: "Conversion analytics", desc: "See which models match but don't convert and why" },
              { icon: Shield,     title: "GDPR compliant",       desc: "All data processing under your controller agreement" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <Icon className="mb-3 h-5 w-5 text-brand/70" />
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-14">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Pricing</p>
            <h2 className="mt-2 text-2xl font-bold">Flat monthly. No per-lead fees.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 space-y-4 ${plan.highlight ? "border-brand/30 bg-brand/8" : "border-white/8 bg-white/[0.03]"}`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">{plan.name}</p>
                  <p className="mt-1 text-3xl font-bold text-white">{plan.price}</p>
                  <p className="mt-0.5 text-xs text-white/40">{plan.desc}</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-brand/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { setSelectedPlan(plan.name.toLowerCase()); setShowForm(true); }}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${plan.highlight ? "bg-brand text-white hover:bg-brand-hover" : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:text-white"}`}
                >
                  Apply for {plan.name} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "4.2min", label: "Avg session time" },
            { value: "68%",    label: "Match-to-lead rate" },
            { value: "£900",   label: "Avg dealer revenue/mo" },
            { value: "3 days", label: "Integration time" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 text-center">
              <p className="text-2xl font-bold text-brand">{s.value}</p>
              <p className="mt-1 text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && !done && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Apply to partner</p>
              <h2 className="mt-1 text-xl font-bold">Partner application</h2>
              <p className="mt-1 text-sm text-white/50">We&apos;ll review your application and reach out within 2 business days to set up a demo.</p>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-2">
                <p className={labelCls}>Plan</p>
                <div className="grid grid-cols-3 gap-2">
                  {["starter", "professional", "enterprise"].map((p) => (
                    <button key={p} type="button"
                      onClick={() => setSelectedPlan(p)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${selectedPlan === p ? "border-brand/40 bg-brand/10 text-brand" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Your name *</label>
                  <input className={inputCls} placeholder="John Smith" value={form.name} onChange={(e) => setF("name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input className={inputCls} type="email" placeholder="john@dealer.co.uk" value={form.email} onChange={(e) => setF("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Dealership name *</label>
                  <input className={inputCls} placeholder="Premier EV Ltd" value={form.dealership} onChange={(e) => setF("dealership", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} type="tel" value={form.phone} onChange={(e) => setF("phone", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Website</label>
                  <input className={inputCls} placeholder="https://yourdealer.co.uk" value={form.website} onChange={(e) => setF("website", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Monthly leads (approx.)</label>
                  <input className={inputCls} type="number" placeholder="150" min={0} value={form.monthly_leads} onChange={(e) => setF("monthly_leads", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Anything else?</label>
                <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Models stocked, integration preferences…" value={form.message} onChange={(e) => setF("message", e.target.value)} />
              </div>
              <button type="submit" disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit application →"}
              </button>
            </form>
          </div>
        )}

        {done && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-14 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <div>
              <p className="text-xl font-bold text-white">Application received</p>
              <p className="mt-1 text-sm text-white/50">We&apos;ll be in touch within 2 business days to arrange your demo.</p>
            </div>
          </div>
        )}

        {!showForm && !done && (
          <div className="text-center pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-bold text-white transition hover:bg-brand-hover"
            >
              Apply to partner <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-white/30">Free demo · 3-day integration · Cancel anytime</p>
          </div>
        )}

      </div>

      <PremiumFooter />
    </main>
  );
}
