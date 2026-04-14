import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CompareLeadCaptureButton from "@/components/leads/CompareLeadCaptureButton";
import type { EVModel } from "@/types";

interface PremiumCompareCTAProps {
  modelA: EVModel;
  modelB: EVModel;
  onReset: () => void;
}

export default function PremiumCompareCTA({ modelA, modelB, onReset }: PremiumCompareCTAProps) {
  return (
    <section className="bg-[#F8FAF9] py-16 pb-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#E5E7EB] bg-gradient-to-br from-zinc-900 to-[#0A0A0A] p-8 text-center shadow-2xl md:p-14">
          <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />

          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-extrabold text-white md:text-5xl">Ready for the next step?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-[#6B7280] md:text-xl">
              If one option feels right, check affordability next. If not, compare another pair until the decision feels more comfortable.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/finance?car=${modelA.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 font-bold text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] sm:w-auto">
                Check affordability for {modelA.brand} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={`/finance?car=${modelB.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-8 py-4 font-bold text-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] sm:w-auto">
                Check affordability for {modelB.brand} <ArrowRight className="w-5 h-5" />
              </Link>
              <CompareLeadCaptureButton modelA={modelA} modelB={modelB} />
            </div>

            <div className="mt-12 border-t border-[#E5E7EB] pt-12">
              <p className="mb-6 text-[#6B7280]">Still weighing your options?</p>
              <button
                onClick={onReset}
                className="rounded-xl border border-[#E5E7EB] bg-white/5 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Compare another pair
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
