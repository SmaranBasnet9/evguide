import Link from "next/link";
import { Landmark } from "lucide-react";

interface FinanceCTAProps {
  title: string;
  description: string;
  href: string;
}

export default function FinanceCTA({ title, description, href }: FinanceCTAProps) {
  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.08] p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            <Landmark className="h-3.5 w-3.5" />
            Affordability check
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-base leading-8 text-zinc-200">{description}</p>
        </div>
        <Link href={href} className="w-fit rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300">
          Check affordability
        </Link>
      </div>
    </section>
  );
}
