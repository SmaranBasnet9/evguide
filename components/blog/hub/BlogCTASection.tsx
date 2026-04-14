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
      ? "border-cyan-300/25 bg-cyan-400/12 text-cyan-100 hover:border-cyan-200/35 hover:bg-cyan-400/18 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
      : "border-emerald-400/25 bg-emerald-400/12 text-emerald-100 hover:border-emerald-300/35 hover:bg-emerald-400/18 hover:shadow-[0_0_28px_rgba(16,185,129,0.18)]";

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
      <div className={`absolute inset-0 bg-gradient-to-r ${accentClass}`} />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">{eyebrow}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#6B7280]">{text}</p>
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
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F8FAF9] px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition duration-300 hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
