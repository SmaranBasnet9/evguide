import Link from "next/link";

interface ArticleCTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function ArticleCTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: ArticleCTAProps) {
  return (
    <section className="rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,211,238,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">AI decision layer</p>
      <h3 className="mt-4 text-3xl font-semibold text-white">{title}</h3>
      <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-200">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={primaryHref} className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300">
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
