import Link from "next/link";
import { GitCompareArrows } from "lucide-react";

interface CompareCTAProps {
  title: string;
  description: string;
  compareHref: string;
  viewHref: string;
}

export default function CompareCTA({ title, description, compareHref, viewHref }: CompareCTAProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300">
            <GitCompareArrows className="h-3.5 w-3.5 text-cyan-300" />
            Comparison shortcut
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-base leading-8 text-zinc-300">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={compareHref} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200">
            Compare now
          </Link>
          <Link href={viewHref} className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            View comparison
          </Link>
        </div>
      </div>
    </section>
  );
}
