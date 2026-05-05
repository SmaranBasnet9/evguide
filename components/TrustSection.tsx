import { CheckCircle2, Landmark, Lock, RefreshCw } from "lucide-react";
import type { ElementType } from "react";

const TRUST_ITEMS: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: RefreshCw,
    title: "Updated Daily",
    desc: "EV specs, prices, and live news refreshed every 24 hours from verified sources.",
  },
  {
    icon: CheckCircle2,
    title: "Verified Reviews",
    desc: "Every user review is moderated and approved by our team before going public.",
  },
  {
    icon: Landmark,
    title: "UK Finance Insights",
    desc: "Finance rates and loan offers sourced from real UK-based lenders, not estimates.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    desc: "We never sell your data. Your comparisons and searches stay between you and us.",
  },
];

export default function TrustSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">Why buyers trust us</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Built for confident EV decisions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Every feature on EV Guide is designed to save you time and money.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
