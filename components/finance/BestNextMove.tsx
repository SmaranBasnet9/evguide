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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Best Next Move
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Clear actions to make this EV decision easier.
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-500">
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
                className="group rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900">{move.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">{move.description}</p>
                <Link
                  href={move.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition group-hover:text-emerald-600"
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
