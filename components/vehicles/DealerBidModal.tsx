"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Loader2, ChevronRight, ChevronLeft, Users, PoundSterling, Car } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LoginPrompt from "@/components/auth/LoginPrompt";

interface Props {
  vehicle: { id: string; brand: string; model: string; price: number };
  onClose: () => void;
}

const FINANCE_TYPES = [
  { value: "pcp",   label: "PCP",   desc: "Lower monthly, option to buy at end" },
  { value: "hp",    label: "HP",    desc: "Hire Purchase — you own it outright" },
  { value: "lease", label: "Lease", desc: "Monthly rental, lowest payments" },
  { value: "cash",  label: "Cash",  desc: "Outright purchase, best total price" },
];

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export default function DealerBidModal({ vehicle, onClose }: Props) {
  const [step, setStep]         = useState<1 | 2>(1);
  const [authed, setAuthed]     = useState<boolean | null>(null);
  const [mounted, setMounted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const overlayRef              = useRef<HTMLDivElement>(null);

  const [financeType, setFinanceType]   = useState("pcp");
  const [budgetMax, setBudgetMax]       = useState(vehicle.price);
  const [monthlyBudget, setMonthlyBudget] = useState(400);
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [tradeIn, setTradeIn]           = useState("");
  const [targetDelivery, setTargetDelivery] = useState("");
  const [notes, setNotes]               = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user);
      if (user) {
        const n = (user.user_metadata?.full_name as string | undefined) ?? "";
        setName((prev) => prev || n);
        setEmail((prev) => prev || (user.email ?? ""));
      }
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit() {
    setError("");
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return setError("Please enter a valid email.");
    if (!phone.trim()) return setError("Please enter your phone number.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/dealer-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim(),
          vehicle_id: vehicle.id,
          vehicle_label: `${vehicle.brand} ${vehicle.model}`,
          budget_max: budgetMax,
          monthly_budget: financeType !== "cash" ? monthlyBudget : null,
          finance_type: financeType,
          trade_in: tradeIn.trim() || null,
          target_delivery: targetDelivery.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "Something went wrong.");
      }
      setDone(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20";

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Dealer Bid Engine</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{vehicle.brand} {vehicle.model}</h2>
          <p className="text-sm text-slate-500">
            Listed at {formatGBP(vehicle.price)} · Verified dealers compete on your best price
          </p>

          {!done && authed !== false && (
            <div className="mt-4 flex items-center gap-2">
              {([1, 2] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {s}
                  </div>
                  {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? "bg-emerald-400" : "bg-slate-200"}`} />}
                </div>
              ))}
              <span className="ml-2 text-xs text-slate-400">
                {step === 1 ? "Finance preferences" : "Your details"}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <CheckCircle className="h-14 w-14 text-emerald-500" />
              <div>
                <p className="text-lg font-bold text-slate-900">Quote request sent!</p>
                <p className="mt-1 text-sm text-slate-500">Verified dealers will respond within 24–48 hours via email.</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-600">
                <Users className="h-4 w-4 text-emerald-500 shrink-0" />
                Dealers compete — you&apos;re not obligated to accept any offer
              </div>
            </div>

          ) : authed === null ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>

          ) : !authed ? (
            <LoginPrompt action="request dealer quotes" returnTo="/vehicles" />

          ) : step === 1 ? (
            <div className="space-y-5">
              {/* Finance type */}
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Finance type</p>
                <div className="grid grid-cols-2 gap-2">
                  {FINANCE_TYPES.map((ft) => (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => setFinanceType(ft.value)}
                      className={`rounded-xl border p-3 text-left transition ${financeType === ft.value ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400/30" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <p className="text-sm font-bold text-slate-900">{ft.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{ft.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max budget slider */}
              <div>
                <div className="mb-2 flex justify-between">
                  <p className="text-sm font-semibold text-slate-700">Max budget</p>
                  <p className="text-sm font-bold text-emerald-600">{formatGBP(budgetMax)}</p>
                </div>
                <input type="range" min={15000} max={120000} step={1000} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="h-2 w-full rounded-full accent-emerald-500" />
                <div className="mt-1 flex justify-between text-xs text-slate-400"><span>£15k</span><span>£120k</span></div>
              </div>

              {/* Monthly budget */}
              {financeType !== "cash" && (
                <div>
                  <div className="mb-2 flex justify-between">
                    <p className="text-sm font-semibold text-slate-700">Monthly budget</p>
                    <p className="text-sm font-bold text-emerald-600">{formatGBP(monthlyBudget)}/mo</p>
                  </div>
                  <input type="range" min={150} max={1500} step={25} value={monthlyBudget} onChange={(e) => setMonthlyBudget(Number(e.target.value))} className="h-2 w-full rounded-full accent-emerald-500" />
                  <div className="mt-1 flex justify-between text-xs text-slate-400"><span>£150</span><span>£1,500</span></div>
                </div>
              )}

              {/* How it works */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">How it works</p>
                {[
                  { icon: PoundSterling, text: "Share your budget and preferences" },
                  { icon: Car,           text: "Verified EV dealers submit their best price" },
                  { icon: Users,         text: "Pick the best offer — or walk away" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon className="h-4 w-4 text-emerald-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Next — your details <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          ) : (
            <div className="space-y-4">
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

              <input type="text"  placeholder="Full name *"      value={name}  onChange={(e) => setName(e.target.value)}  className={inputCls} />
              <input type="email" placeholder="Email address *"  value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              <input type="tel"   placeholder="Phone number *"   value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />

              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-500">Part exchange? (optional)</p>
                <input type="text" placeholder="e.g. 2021 Ford Focus, 35,000 miles" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} className={inputCls} />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-500">Target delivery (optional)</p>
                <input type="month" value={targetDelivery} onChange={(e) => setTargetDelivery(e.target.value)} className={inputCls} />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-500">Notes for dealers (optional)</p>
                <textarea placeholder="Colour preference, trim, accessibility needs…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setStep(1); setError(""); }} className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send to dealers →"}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                Contact details are only shared with dealers who bid. No unsolicited calls from third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
