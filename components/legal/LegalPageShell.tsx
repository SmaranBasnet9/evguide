import type { ReactNode } from "react";
import PremiumFooter from "@/components/home/PremiumFooter";
import PremiumNavbar from "@/components/home/PremiumNavbar";

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}

export default function LegalPageShell({
  eyebrow,
  title,
  intro,
  children,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-white">
      <PremiumNavbar />
      <section className="border-b border-[#E5E7EB] pt-32">
        <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#6B7280]">{intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 rounded-[2rem] border border-[#E5E7EB] bg-white/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
