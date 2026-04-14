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
    <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(16,185,129,0.08),rgba(34,211,238,0.08))] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Ready to move</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#1A1A1A]">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="rounded-full bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-emerald-300">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="rounded-full border border-[#E5E7EB] bg-[#F8FAF9] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
