import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Cookie Policy | ${companyProfile.brandName}`,
  description: `How ${companyProfile.brandName} uses cookies, local storage, and consent controls.`,
};

function Row({ name, purpose, essential }: { name: string; purpose: string; essential: string }) {
  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-white/8 bg-black/20 p-4 sm:grid-cols-[1fr_2fr_0.8fr]">
      <div className="font-medium text-white">{name}</div>
      <div className="text-sm leading-7 text-zinc-300">{purpose}</div>
      <div className="text-sm text-zinc-400">{essential}</div>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Cookie Policy"
      intro="This page explains how EVGuide uses cookies and similar technologies, including local storage, and how you can control non-essential analytics tracking."
    >
      <section>
        <h2 className="text-2xl font-semibold text-white">How we use cookies</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>We use essential technologies where needed to run login sessions, security, and core product behaviour.</p>
          <p>We only use non-essential analytics cookies and similar identifiers if you choose “Accept analytics” in our consent banner.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">Current categories</h2>
        <div className="mt-4 space-y-3">
          <Row
            name="Authentication and session cookies"
            purpose="Used by core account, authentication, and platform security features."
            essential="Essential"
          />
          <Row
            name="Analytics consent preference"
            purpose="Stores whether you accepted or rejected analytics cookies so your preference can be respected."
            essential="Essential"
          />
          <Row
            name="Anonymous analytics session identifier"
            purpose="Used to measure visits, engagement, and journey analytics only if analytics consent has been granted."
            essential="Non-essential"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">How to change your choice</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>You can reject analytics when the consent banner appears. If analytics has already been accepted, you should provide an easy settings control before full public launch.</p>
          <p>You can also clear cookies and local storage through your browser settings.</p>
        </div>
      </section>
    </LegalPageShell>
  );
}
