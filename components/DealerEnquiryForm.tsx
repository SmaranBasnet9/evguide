"use client";

import { FormEvent, useState } from "react";
import { CheckCircle } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "mb-2 block text-sm font-medium text-white/70";

type Props = {
  listingId: string;
  vehicleTitle: string;
};

export default function DealerEnquiryForm({ listingId, vehicleTitle }: Props) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, ...form }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
          <CheckCircle className="h-7 w-7 text-brand" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">Enquiry sent</h3>
        <p className="mt-2 text-sm text-white/50">
          The dealer will be in touch with you shortly about the{" "}
          <span className="text-white">{vehicleTitle}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Full name *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={set("fullName")}
            required
            className={inputCls}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            required
            className={inputCls}
            placeholder="jane@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className={inputCls}
            placeholder="+44 7700 900000"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Message</label>
          <textarea
            value={form.message}
            onChange={set("message")}
            rows={4}
            className={inputCls + " resize-none"}
            placeholder={`I'm interested in the ${vehicleTitle}. Is it still available?`}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-brand py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send enquiry"}
      </button>
      <p className="text-center text-xs text-white/30">
        Your details are shared only with this dealer.
      </p>
    </form>
  );
}
