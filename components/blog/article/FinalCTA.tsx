import Link from "next/link";

interface FinalCTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export default function FinalCTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: FinalCTAProps) {
  return (
    <section className="border-t border-white/10 bg-surface-base">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(16,185,129,0.08),rgba(34,211,238,0.08))] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Ready to move</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.10] hover:text-white">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
