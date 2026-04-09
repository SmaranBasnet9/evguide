import Link from "next/link";
import { ArrowRight, Bot, CarFront, HandCoins } from "lucide-react";

const actions = [
  {
    title: "Request a guided finance follow-up",
    description: "Share your interest and we can help you move from estimate to a real-world next step.",
    href: "/recommend",
    icon: HandCoins,
    primary: true,
  },
  {
    title: "Start AI Match",
    description: "Let the platform suggest the EV and structure that fits your budget best.",
    href: "/assistant",
    icon: Bot,
    primary: false,
  },
  {
    title: "Compare Finance-Friendly EVs",
    description: "Explore lower-pressure alternatives without losing momentum.",
    href: "/vehicles",
    icon: CarFront,
    primary: false,
  },
];

export default function FinanceCTA() {
  return (
    <section className="bg-[#07090B] py-16 pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300">
              Next Step
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              Turn the affordability signal into action.
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">
              You now have an indicative monthly cost. The next move is refining the shortlist,
              checking real-world affordability, or asking for a follow-up conversation.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group rounded-[2rem] border p-6 transition duration-300 ${
                    action.primary
                      ? "border-emerald-400/30 bg-emerald-400/12 hover:bg-emerald-400/16"
                      : "border-white/10 bg-black/20 hover:border-cyan-400/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{action.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{action.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Continue
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
