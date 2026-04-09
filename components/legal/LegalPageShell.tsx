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
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <PremiumNavbar />
      <section className="border-b border-white/8 pt-32">
        <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">{intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 rounded-[2rem] border border-white/10 bg-[#111111]/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
