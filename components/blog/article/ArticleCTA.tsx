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
    <section className="rounded-[2rem] border border-cyan-200 bg-cyan-50 p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">AI decision layer</p>
      <h3 className="mt-4 text-3xl font-semibold text-black">{title}</h3>
      <p className="mt-4 max-w-2xl text-base leading-8 text-black">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={primaryHref} className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300">
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
