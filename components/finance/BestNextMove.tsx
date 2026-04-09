import Link from "next/link";
import { ArrowRight, LineChart, PoundSterling, Sparkles } from "lucide-react";

interface NextMove {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: "deposit" | "compare" | "ai";
}

interface BestNextMoveProps {
  moves: NextMove[];
}

const iconMap = {
  deposit: PoundSterling,
  compare: LineChart,
  ai: Sparkles,
};

export default function BestNextMove({ moves }: BestNextMoveProps) {
  return (
    <section className="bg-[#0B0F12] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Best Next Move
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Clear actions to make this EV decision easier.
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-400">
            The calculator should not leave you at a dead end. These next steps help lower risk,
            improve affordability, or move you toward a real offer.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {moves.map((move) => {
            const Icon = iconMap[move.icon];

            return (
              <div
                key={move.title}
                className="group rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{move.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{move.description}</p>
                <Link
                  href={move.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-emerald-300"
                >
                  {move.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
