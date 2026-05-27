"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, CheckCircle } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "mb-2 block text-sm font-medium text-white/70";

export default function DealerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    fcaFrn: "",
    website: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/dealer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-surface-base px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-white">Application submitted</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">
            We&apos;ll review your dealership application within 2 business days.
            You&apos;ll receive an email once your account is approved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-base px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
            <Building2 className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">EV Guide</p>
            <h1 className="text-xl font-bold text-white">Dealer Registration</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/50">
          Register your dealership to list vehicles on EV Guide. You must already have an EV Guide account —{" "}
          <Link href="/signup" className="text-brand hover:text-brand-hover">sign up first</Link> if you haven&apos;t already.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Company name *</label>
              <input type="text" value={form.companyName} onChange={set("companyName")} required className={inputCls} placeholder="EV Motors Ltd" />
            </div>
            <div>
              <label className={labelCls}>Contact name *</label>
              <input type="text" value={form.contactName} onChange={set("contactName")} required className={inputCls} placeholder="Your name" />
            </div>
            <div>
              <label className={labelCls}>Business phone *</label>
              <input type="tel" value={form.phone} onChange={set("phone")} required className={inputCls} placeholder="+44 20 7946 0958" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Business email *</label>
              <input type="email" value={form.email} onChange={set("email")} required className={inputCls} placeholder="sales@evmotors.co.uk" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Address line 1 *</label>
              <input type="text" value={form.addressLine1} onChange={set("addressLine1")} required className={inputCls} placeholder="123 High Street" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Address line 2</label>
              <input type="text" value={form.addressLine2} onChange={set("addressLine2")} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls}>City *</label>
              <input type="text" value={form.city} onChange={set("city")} required className={inputCls} placeholder="London" />
            </div>
            <div>
              <label className={labelCls}>Postcode *</label>
              <input type="text" value={form.postcode} onChange={set("postcode")} required className={inputCls} placeholder="SW1A 1AA" />
            </div>
            <div>
              <label className={labelCls}>FCA/FRN number</label>
              <input type="text" value={form.fcaFrn} onChange={set("fcaFrn")} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls}>Website</label>
              <input type="url" value={form.website} onChange={set("website")} className={inputCls} placeholder="https://evmotors.co.uk" />
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit application"}
          </button>

          <p className="text-center text-xs text-white/40">
            By submitting you agree to our{" "}
            <Link href="/terms" className="underline hover:text-white/70">Terms of Service</Link>.
          </p>
        </form>
      </div>
    </main>
  );
}
