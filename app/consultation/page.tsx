import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import ConsultationPageClient from "@/components/consultation/ConsultationPageClient";

export const metadata = {
  title: "EV Consultation | EVGuide AI",
  description: "Your personalised EV consultation — takes 2 minutes, no signup needed.",
};

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-surface-base">
      <PremiumNavbar />

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-6">
        {/* Page header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Free · Takes 2 minutes · No signup
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Your personalised EV consultation
          </h1>
          <p className="mt-4 text-base leading-7 text-white/60">
            Tell us about your life and we&apos;ll match you to the right EV — including real monthly
            costs and charging suitability.
          </p>
        </div>

        {/* Wizard card */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
          <ConsultationPageClient />
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}
