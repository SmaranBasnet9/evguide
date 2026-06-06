import Link from "next/link";
import { ArrowRight, Bot, Calculator, GitCompareArrows } from "lucide-react";

const JOURNEY_STEPS = [
  {
    title: "Find your match",
    description:
      "Start with AI Match to turn budget, charging setup, and driving habits into a shortlist that actually fits.",
    label: "Start Match",
    href: "/ai-match",
    icon: Bot,
  },
  {
    title: "Compare options",
    description:
      "Move from content into a side-by-side decision flow so range, charging speed, and value feel obvious.",
    label: "Compare EVs",
    href: "/compare",
    icon: GitCompareArrows,
  },
  {
    title: "Check affordability",
    description:
      "Pressure-test monthly ownership before you commit and understand whether the shortlist still works in real life.",
    label: "Check affordability",
    href: "/finance",
    icon: Calculator,
  },
] as const;

export default function BuyerJourneySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">Buyer journey</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Move from reading to a confident EV decision
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-black">
          Every article should make the next product step feel obvious, not hidden behind another layer of research.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {JOURNEY_STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="group rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/25"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-black">Step 0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold text-black">{step.title}</h3>
              <p className="mt-4 min-h-[96px] text-sm leading-7 text-black">{step.description}</p>
              <Link
                href={step.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition duration-300 hover:text-brand-hover"
              >
                {step.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
