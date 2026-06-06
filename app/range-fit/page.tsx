import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import RangeFitWizard from "@/components/range-fit/RangeFitWizard";

export const metadata: Metadata = {
  title: "EV Life Fit — Range Confidence Score™ | EVGuide",
  description:
    "Enter your real UK routes and find out which EVs cover them — without range anxiety. Real-world ranges, winter adjustments, charge stop estimates.",
};

export default function RangeFitPage() {
  return (
    <main className="min-h-screen bg-[#09090B] font-sans text-white selection:bg-brand/30">
      <PremiumNavbar />

      {/* Hero strip */}
      <div className="border-b border-white/[0.06] bg-[#09090B] px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Back nav */}
          <Link
            href="/vehicles"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white/30 transition hover:text-white/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to EVs
          </Link>

          {/* Trust strip */}
          <div className="mb-8 flex flex-wrap gap-6 text-xs text-white/30">
            <span>✓ Real-world ranges, not WLTP lab figures</span>
            <span>✓ UK winter adjustment built in</span>
            <span>✓ No account needed</span>
          </div>

          <RangeFitWizard />
        </div>
      </div>

      {/* How it works */}
      <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">How it works</p>
          <h2 className="mt-2 text-xl font-black text-white">Why this is different</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📍",
                title: "Your routes, not averages",
                body: "We analyse your exact postcodes, not a generic daily commute. Manchester to Sheffield is different from London to Brighton.",
              },
              {
                icon: "❄️",
                title: "UK winter accounted for",
                body: "UK cold weather and cabin heating can cut EV range by 25–35%. We show you the real winter figure, not the summer brochure number.",
              },
              {
                icon: "⚡",
                title: "Charge stops costed in",
                body: "If your trip needs a charge stop, we tell you how many, where (roughly), and how long — so you can decide if that's OK for you.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/45">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Range Confidence Score™ explainer */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">The score explained</p>
          <h2 className="mt-2 text-xl font-black text-white">Range Confidence Score™</h2>
          <p className="mt-2 text-sm text-white/45">A single number (0–100) telling you how well an EV handles your specific life.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { grade: "A", range: "90–100", label: "Perfect fit", colour: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", desc: "Covers all your routes with charge to spare, including cold UK winters." },
              { grade: "B", range: "75–89", label: "Great fit",    colour: "text-brand border-brand/30 bg-brand/10",                 desc: "Handles everything comfortably. Very occasional tight moments on long trips." },
              { grade: "C", range: "55–74", label: "Good fit",     colour: "text-amber-400 border-amber-400/30 bg-amber-400/10",     desc: "Works well for daily use. Longer trips may need one planned charge stop." },
              { grade: "D", range: "35–54", label: "Manageable",   colour: "text-orange-400 border-orange-400/30 bg-orange-400/10",  desc: "Covers your commute but regular longer journeys need charging stops." },
            ].map((item) => (
              <div key={item.grade} className={`flex items-start gap-4 rounded-2xl border p-4 ${item.colour}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-black ${item.colour}`}>
                  {item.grade}
                </div>
                <div>
                  <p className="text-xs font-bold">{item.label} · {item.range}</p>
                  <p className="mt-1 text-xs leading-relaxed opacity-70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
