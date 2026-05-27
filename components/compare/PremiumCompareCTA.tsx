"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CompareQuotationModal from "@/components/compare/CompareQuotationModal";
import LeadCaptureModal from "@/components/leads/LeadCaptureModal";
import type { EVModel } from "@/types";

interface Props {
  modelA: EVModel;
  modelB: EVModel;
  winner: EVModel;
  onReset: () => void;
  autoOpenQuote?: boolean;
}

export default function PremiumCompareCTA({ modelA, modelB, winner, onReset, autoOpenQuote }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);

  useEffect(() => {
    if (!autoOpenQuote) return;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setQuoteOpen(true);
    });
  }, [autoOpenQuote, supabase]);

  const winnerLabel = `${winner.brand} ${winner.model}`;

  async function handleGetQuotation() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const next = encodeURIComponent(`/compare?carA=${modelA.id}&carB=${modelB.id}&openQuote=true`);
      router.push(`/login?next=${next}`);
      return;
    }
    setQuoteOpen(true);
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/20 bg-gray-50">
          {/* Top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 hidden h-56 w-56 rounded-full bg-brand/8 blur-[50px] sm:block" />

          <div className="relative z-10 flex flex-col gap-8 p-8 md:flex-row md:items-center sm:p-12">
            {/* Left — copy */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Next Step</p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
                Want the best deal on the{" "}
                <span className="text-brand">{winnerLabel}</span>?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
                Get a no-obligation quote with full pricing — vehicle cost, finance at the best
                available bank rate, and insurance estimate — or speak directly with an EV expert.
              </p>
              <Link
                href={`/finance?car=${winner.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-hover"
              >
                Check monthly payments for the {winner.model}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right — CTAs */}
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
              <button
                type="button"
                onClick={handleGetQuotation}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(31,191,159,0.3)] transition hover:bg-brand-hover hover:shadow-[0_0_40px_rgba(31,191,159,0.4)]"
              >
                Get Quotation
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setExpertOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to an Expert
              </button>
            </div>
          </div>

          {/* Compare another pair */}
          <div className="relative z-10 border-t border-gray-200 px-8 py-5 text-center sm:px-12">
            <p className="text-sm text-gray-300">Still weighing your options?</p>
            <button
              type="button"
              onClick={onReset}
              className="mt-1.5 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-gray-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Compare a different pair
            </button>
          </div>
        </div>
      </div>

      <CompareQuotationModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        vehicle={winner}
        modelA={modelA}
        modelB={modelB}
      />
      <LeadCaptureModal
        open={expertOpen}
        onClose={() => setExpertOpen(false)}
        interestType="compare"
        title="Talk to an EV expert"
        description="Tell us what you need and we'll recommend the right EV for your situation."
        submitLabel="Send Message"
        vehicleLabel={`${modelA.brand} ${modelA.model} vs ${modelB.brand} ${modelB.model}`}
        defaultMessage={`I compared the ${modelA.brand} ${modelA.model} and ${modelB.brand} ${modelB.model} and would like some guidance from an expert.`}
      />
    </section>
  );
}
