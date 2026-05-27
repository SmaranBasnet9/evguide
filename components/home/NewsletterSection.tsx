"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Zap, Bell, Tag } from "lucide-react";

export default function NewsletterSection() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error ?? "Something went wrong."); setStatus("error"); }
      else { setStatus("success"); setEmail(""); }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 border-t border-gray-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1FBF9F]/8 blur-[60px] sm:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">

          {/* Left — copy */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1FBF9F]/30 bg-[#1FBF9F]/10 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 text-[#1FBF9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#1FBF9F]">EV Insider</span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get the best EV deals<br className="hidden sm:block" /> straight to your inbox
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Weekly deal alerts, new arrivals, charging tips and finance offers — curated for UK EV buyers. No spam, unsubscribe any time.
            </p>

            {/* Perks */}
            <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4 lg:flex-col lg:gap-2">
              {[
                { icon: Tag,  text: "Exclusive deals before they go live" },
                { icon: Bell, text: "New vehicle alerts matching your budget" },
                { icon: Zap,  text: "EV news and charging guides weekly" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon className="h-4 w-4 shrink-0 text-[#1FBF9F]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-8">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1FBF9F]/20 text-[#1FBF9F]">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">You&apos;re on the list!</p>
                    <p className="mt-1 text-sm text-gray-500">Watch your inbox for your first deal alert.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1FBF9F]">
                    Free · No spam · Unsubscribe any time
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">Stay in the loop</h3>
                  <p className="mt-1 text-sm text-gray-400">Join 4,200+ UK EV buyers already subscribed.</p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={status === "loading"}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1FBF9F] py-3.5 text-sm font-bold text-white transition hover:bg-[#17A589] disabled:opacity-60"
                    >
                      {status === "loading" ? "Subscribing…" : (
                        <>Get Free Deal Alerts <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                    {status === "error" && (
                      <p className="text-center text-xs text-red-400">{errMsg}</p>
                    )}
                  </form>

                  <p className="mt-4 text-center text-[11px] text-gray-400">
                    By subscribing you agree to our Privacy Policy. We never share your data.
                  </p>
                </>
              )}
            </div>

            {/* Social proof avatars */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["#3B82F6","#10B981","#F97316","#8B5CF6","#EAB308"].map((c) => (
                  <div key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs text-gray-400">4,200+ subscribers across the UK</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
