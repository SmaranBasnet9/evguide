import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogCTASectionProps {
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  eyebrow?: string;
  accent?: "emerald" | "cyan";
}

export default function BlogCTASection({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  eyebrow = "Next step",
  accent = "emerald",
}: BlogCTASectionProps) {
  const accentClass =
    accent === "cyan"
      ? "from-cyan-400/20 via-cyan-400/8 to-transparent"
      : "from-emerald-400/18 via-emerald-400/8 to-transparent";
  const primaryClass =
    accent === "cyan"
      ? "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
      <div className={`absolute inset-0 bg-gradient-to-r ${accentClass}`} />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">{eyebrow}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">{title}</h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-black">{text}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={primaryHref}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 ${primaryClass}`}
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-black transition duration-300 hover:border-brand/30 hover:bg-brand/10"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
