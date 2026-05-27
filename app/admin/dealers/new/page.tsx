"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "mb-2 block text-sm font-medium text-white/70";

export default function AdminCreateDealerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [created, setCreated] = useState<{ companyName: string; email: string } | null>(null);

  const [form, setForm] = useState({
    companyName:  "",
    contactName:  "",
    email:        "",
    phone:        "",
    addressLine1: "",
    addressLine2: "",
    city:         "",
    postcode:     "",
    fcaFrn:       "",
    website:      "",
    password:     "",
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/dealers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setCreated({ companyName: form.companyName, email: form.email });
  };

  if (created) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">Dealer created</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            <span className="font-semibold text-white">{created.companyName}</span> has been created and their
            account is active. They can log in at{" "}
            <span className="text-brand">{created.email}</span> with the password you set.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/admin/dealers"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              All Dealers
            </Link>
            <Link
              href="/admin/dealers/new"
              onClick={() => setCreated(null)}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Create another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/dealers"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dealers
      </Link>

      <p className="text-sm font-semibold text-brand">Dealer Management</p>
      <h1 className="mt-1 text-3xl font-bold text-white">Create Dealer</h1>
      <p className="mt-1 text-white/50">
        Create a dealer account. The dealer can immediately log in and start adding vehicles for your approval.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Business info */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/40">
            Business Information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Company name *</label>
              <input type="text" value={form.companyName} onChange={set("companyName")} required className={inputCls} placeholder="EV Motors Ltd" />
            </div>
            <div>
              <label className={labelCls}>Contact name *</label>
              <input type="text" value={form.contactName} onChange={set("contactName")} required className={inputCls} placeholder="John Smith" />
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <input type="tel" value={form.phone} onChange={set("phone")} required className={inputCls} placeholder="+44 20 7946 0958" />
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
        </section>

        {/* Login credentials */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/40">
            Login Credentials
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Dealer email (login) *</label>
              <input type="email" value={form.email} onChange={set("email")} required className={inputCls} placeholder="dealer@evmotors.co.uk" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Temporary password *</label>
              <input
                type="text"
                value={form.password}
                onChange={set("password")}
                required
                minLength={8}
                className={inputCls}
                placeholder="Min. 8 characters — share this with the dealer"
              />
              <p className="mt-2 text-xs text-white/40">
                Share these credentials with the dealer. They can change their password from their profile.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand px-8 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Creating dealer..." : "Create dealer account"}
          </button>
          <Link
            href="/admin/dealers"
            className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
