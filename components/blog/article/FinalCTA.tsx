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
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Ready to move</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-black sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="rounded-full border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-100">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
