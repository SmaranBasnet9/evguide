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
    <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-black">
            <GitCompareArrows className="h-3.5 w-3.5 text-cyan-300" />
            Comparison shortcut
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-black">{title}</h3>
          <p className="mt-3 text-base leading-8 text-black">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={compareHref} className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover">
            Compare now
          </Link>
          <Link href={viewHref} className="rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
            View comparison
          </Link>
        </div>
      </div>
    </section>
  );
}
